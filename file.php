<?php

class BlockedProcessReport {

    private $blockedQueries = [];
    private $blockingQueries = [];
    private $allQueries = [];

    public function addBlocking($query) {
        $this->addQuery($query, $this->blockingQueries);
        $this->addQuery($query, $this->allQueries);
    }

    public function addBlocked($query) {
        $this->addQuery($query, $this->blockedQueries);
        $this->addQuery($query, $this->allQueries);
    }

    private function addQuery($query, &$queryStore) {
        if (empty($queryStore[$query])) {
            $queryStore[$query] = 0;
        }
        $queryStore[$query]++;
    }

    private function queryReport($queryStore) {


        $queryStore = array_reverse($queryStore, true);

        foreach ($queryStore as $query => $count) {
            echo "\n$count executions:\n\t$query\n";
        }
    }

    public function report() {

        asort($this->blockedQueries);
        asort($this->blockingQueries);
        asort($this->allQueries);

        echo "Found " . count($this->allQueries) . " total unique queries\n";
        echo "Found " . count($this->blockedQueries) . " blocked unique queries\n";
        echo "Found " . count($this->blockingQueries) . " blocking unique queries\n";

        echo "\n\n\n========== Blocked queries:\n";
        $this->queryReport($this->blockedQueries);
        echo "\n\n\n========== Blocking queries:\n";
        $this->queryReport($this->blockingQueries);
    }

}


function processBlockedProcessReportEvent(SimpleXMLElement $element, BlockedProcessReport $bpr) {

    $blockedProcessReport = (string) $element->xpath('Column[@name="TextData"]/text()')[0];

    $bprXml         = simplexml_load_string($blockedProcessReport);
    $blockedQuery   = trim((string) $bprXml->xpath('//blocked-process/process/inputbuf')[0]);
    $blockingQuery  = trim((string) $bprXml->xpath('//blocking-process/process/inputbuf')[0]);

    $bpr->addBlocked($blockedQuery);
    $bpr->addBlocking($blockingQuery);
}

$bpr    = new BlockedProcessReport();

$xml    = simplexml_load_file('/home/janek/Downloads/full-trace.xml');
$events = $xml->xpath('/TraceData/Events/Event[@name="Blocked process report"]');

echo "Found " . count($events) . " Blocked process report events\n";
foreach ($events as $i => $event) {
    processBlockedProcessReportEvent($event, $bpr);
}


$bpr->report();
