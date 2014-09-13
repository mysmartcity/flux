<?php
  ini_set('user_agent', "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");

  function trace($sData = "") {
    echo "{$sData}\n";
  }

  function crawl($sUrl) {
    static $aSeen = array();
    if (isset($aSeen[$sUrl]))
      return;

    $aMasterParts = parse_url($sUrl);  //get the parts of the url so we can later check if we're only crawling the same domain
    $aSeen[$sUrl] = true;   //if we crawled this page in the past we ignore it

    trace(" >> CRAWLING: {$sUrl}");

    $oDom = new DOMDocument('1.0');
    if(!@$oDom->loadHTMLFile($sUrl)) { //crawl the given url
      //BUG: we cant store any cookies so sites relying on SESSION_ID will fail hard
      trace("*   INVALID RESPONSE");
      return;
    } 

    $sUrlHash = md5($sUrl);         //create the url and content hash
    $sContent = $oDom->saveHTML();
    $sContentHash = md5($sContent);

    trace("     -> Url Hash: {$sUrlHash}");
    trace("        Content length: " . strlen($sContent) . " bytes");
    trace("        ContentHash: " . $sContentHash);
    trace();

    //todo: check if the content is new
    //todo: if its not new, then parse it for new data
    parse($oDom);

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
        crawl($sHref);
      }
      else {
        trace("*** IGNORING: {$sHref} (not in our scope)");
      }
    }
  }


  function parse($oDom) {
    if(!$oDom)
      return;

    $aHeaders = ["h1", "h2", "h3", "h4"];

    foreach ($aHeaders as $sHeader) { //iterate all h1-h4 tags
      $oHeaders = $oDom->getElementsByTagName($sHeader);
      $sArticleTitle = "";
      $sArticleContent = "";

      foreach ($oHeaders as $oHeader) {
        $sArticleTitle = trim($oHeader->textContent);
        $iWords = str_word_count($sArticleTitle);

        if($iWords > 5) {
          //possible title candidate so we'll try to find a coresponding paragraph
          $iParentNodes = 0;
          $oParagraphs = $oHeader->parentNode;
          while($oParagraphs->getElementsByTagName("p")->length == 0 && $iParentNodes < 5) {
            //go back in the tree untill we find a common root containing at least one paragraph
            $oParagraphs = $oParagraphs->parentNode;
            $iParentNodes++;
          }

          foreach ($oParagraphs->getElementsByTagName("p") as $oParagraph) {
            //possible paragraph candidate so we'll get the content
            $sContent = trim($oParagraph->textContent);
            $iWords = str_word_count($sContent);
            if($iWords > 5)
              $sArticleContent .= $sContent;

            //BUG: unicode text issues

          }

          if($sArticleContent != "") {
            trace("----------------------------");
            trace("TITLU: {$sArticleTitle}");
            trace("CONTENT: {$sArticleContent}");
            trace("----------------------------");
          }


        }
      }
    }

  }

  crawl("http://www.mt.ro/");
?>