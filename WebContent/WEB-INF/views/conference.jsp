<%@ include file="/WEB-INF/jspf/header.jspf"%>

<a href="https://developers.bistri.com" target="_blank"
	class="bistri-logo"></a>
<div class="stripes"></div>

<div class="remote-streams">
	<div id="ligne1">
		<div class="span6" id="video-1"></div>
		<div class="span6" id="video-2"></div>
	</div>

	<div id="ligne2">
		<div class="span6" id="video-3"></div>
		<div class="span6 local-stream"></div>
	</div>

	<!-- etherpad div -->
	<div id="etherpad" onload="convey();">
		<iframe id="docLink" class="etherpad-part" src="shareLink"></iframe>
	</div>
</div>

<div class="span4 control" data-bind="visible: joinedRoom">
	<pre class="conference-link">Copy and share the following link with your friends to start the<br />conference:
		<textarea
			style="width: 35%; display: block; margin-left: auto; margin-right: auto;"
			data-bind="click: selectContent"></textarea>
	<input type="button" value="Quit Conference" class="center1"
			data-bind="click: quitConference" />
	</pre>

	<!--<p class="doc">Want to learn how to use Bistri WebRTC Api ? Take a look at the <a href= "https://api.developers.bistri.com/documentation" target="_blank">Api Documentation</a></p>-->

</div>


<div class="row-fluid compatibility webcam center1"
	data-bind="visible: !isCompatible()">
	<div class="span12">
		Sorry your browser is not compatible.<br>We invite you to use a
		webRTC enabled browser: <a
			href="http://www.mozilla.org/en-US/firefox/new/" target="_blank">Firefox
			22+</a> or <a href="https://www.google.com/intl/en/chrome/browser/"
			target="_blank">Chrome 23+</a> or <a href="http://www.opera.com/fr/"
			target="_blank">Opera 18+</a>
	</div>
</div>

<div class="row-fluid connecting"
	data-bind="visible: !connected() && isCompatible()">
	<div class="span12 webcam center1">connecting ...</div>
</div>

<div class="row-fluid device-selector webcam"
	data-bind="visible: connected() && !joinedRoom()">
	<div class="span12" style="text-align: center; display: inline-block;">
		<div>
			<input type="button" value="Use SD webcam"
				style="width: 39%; height: 20%;" data-bind="click: startWebcamSD" />
		
			<input type="button" value="Use HD webcam"
				style="width: 39%; height: 20%;" data-bind="click: startWebcamHD" />
		
			<!-- <input type="button" value="Share screen (*)"
				style="width: 25.5%; height: 10%" data-bind="click: shareScreen" /> -->
		</div>
		<p class="warn">(*): Screen sharing feature is available in Google
			Chrome 27+ with "Enable screen capture support in getUserMedia()"
			flag activated in chrome://flags</p>
	</div>
</div>

<%@ include file="/WEB-INF/jspf/footer.jspf"%>