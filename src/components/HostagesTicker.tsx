import React, { useEffect } from 'react';

const HostagesTicker: React.FC = () => {
  useEffect(() => {
   var script = document.createElement("script");
   script.type = "text/javascript";
   script.src = "https://bringthemhomenow.net/1.1.0/hostages-ticker.js";
   script.setAttribute(
     "integrity",
     "sha384-DHuakkmS4DXvIW79Ttuqjvl95NepBRwfVGx6bmqBJVVwqsosq8hROrydHItKdsne"
   );
   script.setAttribute("crossorigin", "anonymous");
   document.getElementsByTagName("body")[0].appendChild(script);
  }, []);

  return <head lang="he"></head>;
};

export default HostagesTicker;
