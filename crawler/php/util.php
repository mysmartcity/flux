<?php
  function trace($sData = "") {
    echo "{$sData}\n";
  }

  function keywordCountSort($aFirst, $aSecond) {
    return $aFirst[1] - $aSecond[1];
  }

  function extractKeywords($sText, $iMinimumWordLength = 3, $iMinimumWordOccurrences = 0) {
    $sText = preg_replace('/[^\p{L}0-9 ]/', ' ', $sText);
    $sText = trim(preg_replace('/\s+/', ' ', $sText));

    trace($sText);
   
    $aWords = explode(' ', $sText);
    $aKeywords = array();
    while(($sCurrentWord = array_shift($aWords)) !== null) {
      if(strlen($sCurrentWord) < $iMinimumWordLength)
        continue;
   
      $sCurrentWord = strtolower($sCurrentWord);
      if(array_key_exists($sCurrentWord, $aKeywords))
        $aKeywords[$sCurrentWord][1]++;
      else
        $aKeywords[$sCurrentWord] = array($sCurrentWord, 1);
    }
    usort($aKeywords, 'keywordCountSort');
   
    $aFinalKeywords = array();
    foreach($aKeywords as $aCurrentKeyword) {
      if($aCurrentKeyword[1] < $iMinimumWordOccurrences)
        break;
      array_push($aFinalKeywords, $aCurrentKeyword[0]);
    }

    $aFinalKeywords = array_slice($aFinalKeywords, 0, 5, true);
    return array_reverse($aFinalKeywords);
  }

  function replaceSpecialChars($sString) {
    $sString = preg_replace('/[^(\x20-\x7F)]*/','', $sString);
    $sString = preg_replace('/xE0[x80-x9F][x80-xBF]|xED[xA0-xBF][x80-xBF]/S','?', $sString);
    return $sString;
  }

?>