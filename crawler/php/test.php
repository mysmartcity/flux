<html>
  <head>
    <style type="text/css">
      * {
        font-family: arial;
      }
      div {
        border:2px solid #0099cc;
        width:500px;
        height:500px;
        float:left;
        margin:5px;
        overflow: auto;
        position: relative;
      }
      div h1 {
        background: #0099cc;
        font-size:16px;
        margin: 0px;
        text-align: center;
        color:#FFFFFF;
        padding:5px;
        min-height: 50px
      }

      div h2 {
        margin: 0px;
        font-size:14px;
        padding:10px;
      }

      div p {
        font-size:12px;
        padding:10px;
      }

      div small {
        font-size:10px;
        padding:10px;
      }

      div a {
        display:block;
        width:100px;
        text-align: center;
        background: #ff4444;
        border-bottom: 4px solid #cc0000;
        color:#FFFFFF;
        text-decoration: none;
        padding:10px;
        margin: 010px 0px 0px 10px;
      }
    </style>
  </head>
  <body>
    <?php
      $oMongo = new MongoClient(); // connect
      $oDb = $oMongo->selectDb("flux");

      $iCnt = 0;
      $oCursor = $oDb->news->find();
      if($oCursor) {
        foreach ($oCursor as $aNews) {
          $iCnt++;
          $sDate = $aNews['date'];
          $sCategory = $aNews['category'];
          $sUrl = $aNews['url'];
          $sTitle = $aNews['title'];
          $sContent = $aNews['content'];
          $aKeywords = $aNews['msk'];

          echo "<div>\n";
            echo "\t<h1>{$iCnt} {$sTitle}</h1>\n";
            echo "\t<h2>Postat in data <i>{$sDate}</i> in categoria <strong>{$sCategory}</strong></h2>\n";
            echo "\t<p>{$sContent}</p>\n";
            echo "\t<small><strong>Keywords:</strong> ".implode(",", $aKeywords)."</small>\n";
            echo "\t<a target=\"_blank\" href=\"{$sUrl}\">Sursa</a>\n";
          echo "</div>\n";

        }
      }
    ?>
  </body>
</html>