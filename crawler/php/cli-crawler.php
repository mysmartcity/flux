<?php
  date_default_timezone_set("Europe/Bucharest");
  ini_set('user_agent', "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
  include "util.php";

  function crawl($sUrl, $sCategory) {
    global $oDb;


    static $aSeen = array();
    if (isset($aSeen[$sUrl]))
      return;

    $aMasterParts = parse_url($sUrl);  //get the parts of the url so we can later check if we're only crawling the same domain
    $aSeen[$sUrl] = true;   //if we crawled this page in the past we ignore it

    trace(" >> CRAWLING: {$sUrl}");

    if(substr($sUrl, -4) == ".pdf" || substr($sUrl, -4) == ".rar" || substr($sUrl, -4) == ".zip" || substr($sUrl, -5) == ".docx" || substr($sUrl, -4) == ".doc") {
      trace("*** IGNORING: " . substr($sUrl, -4));
      return;
    }
    
    $sRawContent = @file_get_contents($sUrl);
    //$sRawContent = replaceSpecialChars($sRawContent);
    //BUG: utf-8 encoding is still wrong


    $oDom = new DOMDocument('1.0');
    if(!@$oDom->loadHTML($sRawContent)) { //crawl the given url
      //BUG: we cant store any cookies so sites relying on SESSION_ID will fail hard
      trace("*   INVALID RESPONSE");
      return;
    } 
    $sRawContent = ""; //free the memory

    $sUrlHash = md5($sUrl);         //create the url and content hash
    $sContent = $oDom->saveHTML();
    $sContentHash = md5($sContent);

    trace("     -> Url Hash: {$sUrlHash}");
    trace("        Content length: " . strlen($sContent) . " bytes");
    trace("        ContentHash: " . $sContentHash);
    trace();


    $oCursor = $oDb->pages->findOne([
      'urlHash' => $sUrlHash,
      'contentHash' => $sContentHash
    ]);
    if($oCursor) {
      //content is found, not changed and already indexed, ignoring for now
      trace("****CONTENT IS NOT CHANGED!");
    }
    else {
      //content is changed so add the urlHash and contentHash to the collection
      $oDb->pages->insert([
        'urlHash' => $sUrlHash,
        'contentHash' => $sContentHash
      ]);

      //parse the dom to get the new content
      parse($oDom, $sCategory, $sUrl);
    }

    //get all the links from the content and recursively crawl each valid link
    $oAnchors = $oDom->getElementsByTagName('a');
    foreach ($oAnchors as $oElement) {
      $sHref = $oElement->getAttribute('href');

      $aParts = parse_url($sHref); //make sure we're only getting the correct scheme: http or https
      if($aParts['scheme'] == "javascript" || $aParts['scheme'] == "ftp") { //ignore ftp:// and javascript:// for now
        trace("**  INVALID SCHEME: {$sHref}");
        continue;
      }

      if (strpos($sHref, 'http') !== 0) { //if the path is relative we'll rebuild it
        $sPath = '/' . ltrim($sHref, '/');
        $aParts = parse_url($sUrl);

        $sHref = $aParts['scheme'] . '://'; //http or https

        if (isset($aParts['user']) && isset($aParts['pass'])) //if we have some sort of authentication, add it here user:pass@url
          $sHref .= $aParts['user'] . ':' . $aParts['pass'] . '@';

        $sHref .= $aParts['host'];
        if (isset($aParts['port'])) {
          $sHref .= ':' . $aParts['port']; //if we have the port other than 80, specified add it here
        }
        $sHref .= $sPath;
      }

      $aParts = parse_url($sHref);
      //double check to see if we're still on the correct scheme and if the target host is in the same scope as the current iteration host
      if(($aParts['scheme'] == "http" || $aParts['https']) && $aParts['host'] == $aMasterParts['host']) {
        crawl($sHref, $sCategory);
      }
      else {
        trace("*** IGNORING: {$sHref} (not in our scope)");
      }
    }
  }


  function parse($oDom, $sCategory, $sSourceUrl) {
    global $oDb;

    if(!$oDom)
      return;

    $aHeaders = ["h1", "h2", "h3", "h4"];

    foreach ($aHeaders as $sHeader) { //iterate all h1-h4 tags
      $oHeaders = $oDom->getElementsByTagName($sHeader);
        foreach ($oHeaders as $oHeader) {
        $sArticleTitle = trim(strip_tags($oHeader->textContent));
        $sArticleContent = "";
        $iWords = str_word_count($sArticleTitle);

        if($iWords > 5) {
          //possible title candidate so we'll try to find a coresponding paragraph
          $iParentNodes = 0;
          $oParagraphs = $oHeader->parentNode;

          while($oParagraphs && $oParagraphs->getElementsByTagName("p")->length == 0 && $iParentNodes < 5) {
            //go back in the tree untill we find a common root containing at least one paragraph
            $oParagraphs = $oParagraphs->parentNode;
            $iParentNodes++;
          }

          if(!$oParagraphs) {
            trace("*** IGNORING documentElement here?!");
            continue 2;
          }

          foreach ($oParagraphs->getElementsByTagName("p") as $oParagraph) {
            //possible paragraph candidate so we'll get the content
            $sContent = trim(strip_tags($oParagraph->textContent));
            $iWords = str_word_count($sContent);
            if($iWords > 5)
              $sArticleContent .= $sContent; //lets make sure we dont get some javascript injected
          }

          $iWords = str_word_count($sArticleContent); //count the words in all the paragraphs to see if we got an article or just excerpt
          if($sArticleContent != "" && $iWords > 15) {

            $aKeywords = extractKeywords($sArticleContent);

            trace("----------------------------");
            trace("CATEGORIE: {$sCategory}");
            trace("SURSA: {$sSourceUrl}");
            trace("TITLU: {$sArticleTitle}");
            //trace("CONTENT: {$sArticleContent} ($iWords)");
            trace("CONTENT: ($iWords) words");
            trace("KEYWORDS: " . implode(",", $aKeywords));
            trace("----------------------------");

            $sArticleHash = md5($sArticleContent);

            $oCursor = $oDb->news->findOne(['hash' => '$sArticleHash']); //check to see if we didnt previously indexed this article
            if(!$oCursor) { //if we didnt find any, lets index this article
              @$oDb->news->insert([
                'hash'      => $sArticleHash,
                'date'      => date('l jS \of F Y h:i:s A'),
                'category'  => $sCategory,
                'url'       => $sSourceUrl,
                'title'     => json_encode($sArticleTitle),
                'content'   => json_encode($sArticleContent),
                'msk'       => json_encode(implode(",", $aKeywords))
              ]);
            }

          }

        }
      }
    }

  }


 

/* main { */
  $oMongo = new MongoClient(); // connect
  $oDb = $oMongo->selectDb("flux");

  //DEBUG: init the collections {
    if(true == true) { //SET TO FALSE DURING PRODUCTION OTHERWISE THE COLLECTIONS WILL BE INITIALIZED
      $oDb->pages->drop();
      $oDb->news->drop();
      $oDb->sources->drop();

      $oDb->sources->insert([
        [
          'category' => 'transport',
          'sources' => [
            'http://www.mt.ro/',
            'http://www.cfr.ro/'
          ]
        ],
        [
          'category' => 'sanatate',
          'sources' => [
            'url' => 'http://www.ms.ro/'
          ]
        ]
        //etc
      ]);
    }
  //} DEBUG

  $oCursor = $oDb->sources->find();
  if($oCursor) {
    foreach ($oCursor as $aCategories) {
      foreach ($aCategories as $aCategory) {
        if(is_array($aCategory)) {
          $sCategory = $aCategory['category'];
          foreach ($aCategory['sources'] as $sUrl) {
            crawl($sUrl, $sCategory);
          }
        }
      }
    }
  }
/* } main */
?>