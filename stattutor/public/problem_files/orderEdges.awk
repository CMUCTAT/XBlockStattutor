$1=="<edge>" {e=""; sn=-1; dn=-1;
			  do {
				e=sprintf("%s%s%s", e, (e == "" ? "" : "\n"), $0);
				if(match($0,"<sourceID>")>0) {f=split($0,A,"[<>]"); if(f>3)sn=A[3]};
				if(match($0,"<destID>")>0) {f=split($0,A,"[<>]"); if(f>3)dn=A[3]};
				getline;
			  } while ($1!="</edge>"); e=sprintf("%s\n%s", e, $0);
			  EDGE[sn]=e;
              DEST[sn]=dn;
              SRC[dn]=sn;
}
END          {for(n in DEST) {if(!SRC[n]) {on=n; break;}}
			  for(n = on; EDGE[n]!=""; n=DEST[n]) print EDGE[n];
}
