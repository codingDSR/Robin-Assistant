<?php

$cmd = "curl 'https://www.google.co.in/search?source=hp&ei=yENbWs-aPIOw0ASZwZjwBQ&q=steve+smith+age&oq=steve+smith+age&gs_l=psy-ab.3..0l5j0i22i30k1l3.2847.10007.0.10280.15.15.0.0.0.0.550.2252.0j2j6j5-1.9.0....0...1.1.64.psy-ab..6.9.2249...0i131k1.0.0NNfh6D39I4' -H 'Host: www.google.co.in' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:57.0) Gecko/20100101 Firefox/57.0' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' -H 'Accept-Language: en-US,en;q=0.5' --compressed -H 'Referer: https://www.google.co.in/' -H 'Cookie: 1P_JAR=2018-1-14-11; NID=121=ZLkRDNxzv0tMkXCH4Jyq_OaC9UQc4eOB-k1KlLpgBBmwbE5cWpQbosWkNZSIOOgWC1ODvJTc-uqpZ2y1rLEjxPVoPyV5ff69CaH6aMSAxJSGlIPgRQvxilpE-jQisUEW' -H 'DNT: 1' -H 'Connection: keep-alive' -H 'Upgrade-Insecure-Requests: 1' >> papa.txt";
	$response["data"] = shell_exec($cmd);

?>


