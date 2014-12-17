// ==UserScript==
// @name        Twitch.tv in VLC
// @namespace   http://shemanaev.com
// @version     1.0
// @description Replace standard flash player with VLC
// @include     http://www.twitch.tv/*
// @match       http://www.twitch.tv/*
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/* https://gist.github.com/raw/2625891/waitForKeyElements.js */
function waitForKeyElements(b,a,h,g){var d,f;if(typeof g=="undefined"){d=$(b)}else{d=$(g).contents().find(b)}if(d&&d.length>0){f=true;d.each(function(){var k=$(this);var l=k.data("alreadyFound")||false;if(!l){var j=a(k);if(j){f=false}else{k.data("alreadyFound",true)}}})}else{f=false}var c=waitForKeyElements.controlObj||{};var i=b.replace(/[^\w]/g,"_");var e=c[i];if(f&&h&&e){clearInterval(e);delete c[i]}else{if(!e){e=setInterval(function(){waitForKeyElements(b,a,h,g)},300);c[i]=e}}waitForKeyElements.controlObj=c};

/* Laura Doktorova https://github.com/olado/doT */
(function(){function o(){var a={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},b=/&(?!#?\w+;)|<|>|"|'|\//g;return function(){return this?this.replace(b,function(c){return a[c]||c}):this}}function p(a,b,c){return(typeof b==="string"?b:b.toString()).replace(a.define||i,function(l,e,f,g){if(e.indexOf("def.")===0)e=e.substring(4);if(!(e in c))if(f===":"){a.defineParams&&g.replace(a.defineParams,function(n,h,d){c[e]={arg:h,text:d}});e in c||(c[e]=g)}else(new Function("def","def['"+
e+"']="+g))(c);return""}).replace(a.use||i,function(l,e){if(a.useParams)e=e.replace(a.useParams,function(g,n,h,d){if(c[h]&&c[h].arg&&d){g=(h+":"+d).replace(/'|\\/g,"_");c.__exp=c.__exp||{};c.__exp[g]=c[h].text.replace(RegExp("(^|[^\\w$])"+c[h].arg+"([^\\w$])","g"),"$1"+d+"$2");return n+"def.__exp['"+g+"']"}});var f=(new Function("def","return "+e))(c);return f?p(a,f,c):f})}function m(a){return a.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var j={version:"1.0.1",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,
interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:true,append:true,selfcontained:false},template:undefined,
compile:undefined},q;if(typeof module!=="undefined"&&module.exports)module.exports=j;else if(typeof define==="function"&&define.amd)define(function(){return j});else{q=function(){return this||(0,eval)("this")}();q.doT=j}String.prototype.encodeHTML=o();var r={append:{start:"'+(",end:")+'",endencode:"||'').toString().encodeHTML()+'"},split:{start:"';out+=(",end:");out+='",endencode:"||'').toString().encodeHTML();out+='"}},i=/$^/;j.template=function(a,b,c){b=b||j.templateSettings;var l=b.append?r.append:
r.split,e,f=0,g;a=b.use||b.define?p(b,a,c||{}):a;a=("var out='"+(b.strip?a.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):a).replace(/'|\\/g,"\\$&").replace(b.interpolate||i,function(h,d){return l.start+m(d)+l.end}).replace(b.encode||i,function(h,d){e=true;return l.start+m(d)+l.endencode}).replace(b.conditional||i,function(h,d,k){return d?k?"';}else if("+m(k)+"){out+='":"';}else{out+='":k?"';if("+m(k)+"){out+='":"';}out+='"}).replace(b.iterate||i,function(h,
d,k,s){if(!d)return"';} } out+='";f+=1;g=s||"i"+f;d=m(d);return"';var arr"+f+"="+d+";if(arr"+f+"){var "+k+","+g+"=-1,l"+f+"=arr"+f+".length-1;while("+g+"<l"+f+"){"+k+"=arr"+f+"["+g+"+=1];out+='"}).replace(b.evaluate||i,function(h,d){return"';"+m(d)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,"").replace(/(\s|;|\}|^|\{)out\+=''\+/g,"$1out+=");if(e&&b.selfcontained)a="String.prototype.encodeHTML=("+
o.toString()+"());"+a;try{return new Function(b.varname,a)}catch(n){typeof console!=="undefined"&&console.log("Could not create a template function: "+a);throw n;}};j.compile=function(a,b){return j.template(a,null,b)}})();


var TOKEN_API = doT.template('http://api.twitch.tv/api/channels/{{=it}}/access_token')
  , USHER_API = doT.template('http://usher.justin.tv/api/channel/hls/{{=it.channel}}.m3u8?token={{=it.token}}&sig={{=it.sig}}')
  , EMBED = doT.template(
              '<div id="vlc" style="width: 100%; height: 100%;"></div>'
            + '<div style="margin-top: 7px;">'
            +   '<input type="text" id="stream-url" class="text fademe" readonly style="height: 26px;" onClick="this.select();" value="{source}" />'
            +   '<select id="quality-selector" style="height: 26px; float: right;">'
            +     '{{ for (var prop in it) { if (it.hasOwnProperty(prop)) }}<option value="{{=it[prop]}}">{{=prop}}</option>{{ } }}'
            +   '</select>'
            + '</div>'
            )
  , VLC = doT.template('<embed type="application/x-vlc-plugin" pluginspage="http://www.videolan.org" width="100%" height="100%" src="{{=it}}"></embed>')

function fireOnChange(element) {
  var evt = document.createEvent('HTMLEvents')
  evt.initEvent('change', false, true)
  element.dispatchEvent(evt)
}

function vlcInit() {
  var channel = document.location.pathname.substr(1)
    , tokenUrl = TOKEN_API(channel)
    , $player = document.querySelector('#player')
    , $stats = document.querySelector('.stats-and-actions')
    , $qualitySelector
    , $vlc
    , $streamUrl

  function onPlaylist(response) {
    var urlsRegEx = /https?:\/\/.*fmt=([a-z]+).*/gi
      , urls = []
      , url

    while (url = urlsRegEx.exec(response.responseText)) {
      urls[url[1]] = url[0]
    }

    $stats.style.marginTop = '20px'
    $player.innerHTML = EMBED(urls)

    $vlc = document.querySelector('#vlc')
    $streamUrl = document.querySelector('#stream-url')
    $qualitySelector = document.querySelector('#quality-selector')

    function qualitySelected() {
      var url = this.value

      $vlc.innerHTML = VLC(url)
      $streamUrl.value = url
    }

    $qualitySelector.addEventListener('change', qualitySelected, false)
    fireOnChange($qualitySelector)
  }

  GM_xmlhttpRequest(
    { method: 'GET'
    , url: tokenUrl
    , headers: { 'Accept': 'application/json' }
    , onload: function (response) {
        var data = JSON.parse(response.responseText)
          , url = USHER_API({ channel: channel, sig: data.sig, token: encodeURIComponent(data.token) })

        GM_xmlhttpRequest(
          { method: 'GET'
          , url: url
          , onload: onPlaylist
          }
        )
      }
    }
  )
}

waitForKeyElements('#player', vlcInit)
