Variante 1: Docker



Variante 2: Starten mit der der "Brechstange"

Schritt 1: Lokale MongoDB starten
Schritt 2: Npm Start im Server Ordner
Schritt 3: Npm Start im react_nodeapp Ordner

Im ReactNodeApp muss der Proxy noch gesetzt werden. 
Im Docker verwende ich einen HTTP Proxy als Dependency.

Vor Browserlist muss folgender Eintrag gemacht werden.
"proxy": "http://localhost:5000"