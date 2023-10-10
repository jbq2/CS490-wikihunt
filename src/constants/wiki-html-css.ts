export const wikiHtmlStyles: string = `
<style>
cite,
dfn {
	font-style: inherit;
}

/* Straight quote marks for <q> */
q {
	quotes: '"' '"' "'" "'";
}

/* Avoid collision of blockquote with floating elements by swapping margin and padding */
blockquote {
	overflow: hidden;
	margin: 1em 0;
	padding: 0 40px;
}

/* Consistent size for <small>, <sub> and <sup> */
small {
	font-size: 85%;
}

.mw-body-content sub,
.mw-body-content sup {
	font-size: 80%;
}

/* Same spacing for indented and unindented paragraphs on talk pages */
.ns-talk .mw-body-content dd {
	margin-top: 0.4em;
	margin-bottom: 0.4em;
}

/* Reduce page jumps by hiding collapsed/dismissed content */
.client-js .collapsible:not( .mw-made-collapsible).collapsed > tbody > tr:not(:first-child),

/* Avoid FOUC/reflows on collapsed elements. */
/* This copies MediaWiki's solution for T42812 to apply to innercollapse/outercollapse (T325115). */
/* TODO: Use :is() selector at some reasonable future when support is good for Most Clients */
/* Reference: https://gerrit.wikimedia.org/g/mediawiki/core/+/ecda06cb2aef55b77c4b4d7ecda492d634419ead/resources/src/jquery/jquery.makeCollapsible.styles.less#75 */
.client-js .outercollapse .innercollapse.mw-collapsible:not( .mw-made-collapsible ) > p,
.client-js .outercollapse .innercollapse.mw-collapsible:not( .mw-made-collapsible ) > table,
.client-js .outercollapse .innercollapse.mw-collapsible:not( .mw-made-collapsible ) > thead + tbody,
.client-js .outercollapse .innercollapse.mw-collapsible:not( .mw-made-collapsible ) tr:not( :first-child ),
.client-js .outercollapse .innercollapse.mw-collapsible:not( .mw-made-collapsible ) .mw-collapsible-content,

/* Hide charinsert base for those not using the gadget */
#editpage-specialchars {
	display: none;
}

/* Make the list of references smaller
 * Keep in sync with Template:Refbegin/styles.css
 * And Template:Reflist/styles.css
 */
ol.references {
	font-size: 90%;
	margin-bottom: 0.5em;
}

/* Cite customizations for Parsoid
 * Once everything uses the one true parser these are just customizations
 */
span[ rel="mw:referencedBy" ] {
	counter-reset: mw-ref-linkback 0;
}

span[ rel='mw:referencedBy' ] > a::before {
	content: counter( mw-ref-linkback, lower-alpha );
	font-size: 80%;
	font-weight: bold;
	font-style: italic;
}

a[ rel="mw:referencedBy" ]::before {
	font-weight: bold;
	content: "^";
}

span[ rel="mw:referencedBy" ]::before {
	content: "^ ";
}

.mw-ref > a[data-mw-group=lower-alpha]::after {
	content: '[' counter( mw-Ref, lower-alpha ) ']';
}

.mw-ref > a[data-mw-group=upper-alpha]::after {
	content: '[' counter( mw-Ref, upper-alpha ) ']';
}

.mw-ref > a[data-mw-group=decimal]::after {
	content: '[' counter( mw-Ref, decimal ) ']';
}

.mw-ref > a[data-mw-group=lower-roman]::after {
	content: '[' counter( mw-Ref, lower-roman ) ']';
}

.mw-ref > a[data-mw-group=upper-roman]::after {
	content: '[' counter( mw-Ref, upper-roman ) ']';
}

.mw-ref > a[data-mw-group=lower-greek]::after {
	content: '[' counter( mw-Ref, lower-greek ) ']';
}

/* Styling for jQuery makeCollapsible, matching that of collapseButton */
.mw-parser-output .mw-collapsible-toggle:not(.mw-ui-button) {
	font-weight: normal;
	padding-right: 0.2em;
	padding-left: 0.2em;
}

.mw-collapsible-leftside-toggle .mw-collapsible-toggle {
	/* @noflip */
	float: left;
}

/* Lists in wikitable data cells are always left-aligned */
.wikitable td ul,
.wikitable td ol,
.wikitable td dl {
	/* @noflip */
	text-align: left;
}

/* Change the external link icon to a PDF icon for all PDF files */
.mw-parser-output a[href$=".pdf"].external,
.mw-parser-output a[href*=".pdf?"].external,
.mw-parser-output a[href*=".pdf#"].external,
.mw-parser-output a[href$=".PDF"].external,
.mw-parser-output a[href*=".PDF?"].external,
.mw-parser-output a[href*=".PDF#"].external {
	background: url("//upload.wikimedia.org/wikipedia/commons/4/4d/Icon_pdf_file.png") no-repeat right;
	/* @noflip */
	padding: 8px 18px 8px 0;
}

/* System messages styled similarly to fmbox */
/* for .mw-warning-with-logexcerpt, behavior of this line differs between
 * the edit-protected notice and the special:Contribs for blocked users
 * The latter has specificity of 3 classes so we have to triple up here.
 */
.mw-warning-with-logexcerpt.mw-warning-with-logexcerpt.mw-warning-with-logexcerpt,
div.mw-lag-warn-high,
div.mw-cascadeprotectedwarning,
div#mw-protect-cascadeon {
	clear: both;
	margin: 0.2em 0;
	border: 1px solid #bb7070;
	background-color: #ffdbdb;
	padding: 0.25em 0.9em;
	box-sizing: border-box;
}

/* default colors for partial block message */
/* gotta get over the hump introduced by the triple class above */
.mw-contributions-blocked-notice-partial .mw-warning-with-logexcerpt.mw-warning-with-logexcerpt {
	border-color: #fc3;
	background-color: #fef6e7;
}

/* Minimum thumb width */
figure[typeof~='mw:File/Thumb'],
figure[typeof~='mw:File/Frame'],
.thumbinner {
	min-width: 100px;
}

/* Prevent floating boxes from overlapping any category listings,
   file histories, edit previews, and edit [Show changes] views. */
#mw-subcategories,
#mw-pages,
#mw-category-media,
#filehistory,
#wikiPreview,
#wikiDiff {
	clear: both;
}

/* Styling for tags in changes pages */
.mw-tag-markers {
	font-style: italic;
	font-size: 90%;
}

/* Hide stuff meant for accounts with special permissions. Made visible again in
   [[MediaWiki:Group-checkuser.css]], [[MediaWiki:Group-sysop.css]], [[MediaWiki:Group-abusefilter.css]],
   [[MediaWiki:Group-abusefilter-helper.css]], [[MediaWiki:Group-patroller.css]],
   [[MediaWiki:Group-templateeditor.css]], [[MediaWiki:Group-extendedmover.css]],
   [[MediaWiki:Group-extendedconfirmed.css]], and [[Mediawiki:Group-autoconfirmed.css]]. */
.checkuser-show,
.sysop-show,
.abusefilter-show,
.abusefilter-helper-show,
.patroller-show,
.templateeditor-show,
.extendedmover-show,
.extendedconfirmed-show,
.autoconfirmed-show,
.user-show {
	display: none;
}

/* Hide the redlink generated by {{Editnotice}},
   this overrides the ".sysop-show { display: none; }" above that applies
   to the same link as well. See [[phab:T45013]]

   Hide the images in editnotices to keep them readable in VE view.
   Long term, editnotices should become a core feature so that they can be designed responsive. */
.ve-ui-mwNoticesPopupTool-item .editnotice-redlink,
.ve-ui-mwNoticesPopupTool-item .mbox-image,
.ve-ui-mwNoticesPopupTool-item .mbox-imageright {
	display: none !important;
}

/* Remove bullets when there are multiple edit page warnings */
ul.permissions-errors {
	margin: 0;
}

ul.permissions-errors > li {
	list-style: none;
}

/* larger inline math */
span.mwe-math-mathml-inline {
	font-size: 118%;
}

/* Make <math display="block"> be left aligned with one space indent for 
 * compatibility with style conventions
 */
.mwe-math-fallback-image-display,
.mwe-math-mathml-display {
	margin-left: 1.6em !important;
	margin-top: 0.6em;
	margin-bottom: 0.6em;
}

.mwe-math-mathml-display math {
	display: inline;
}

@media screen {
	/* Put a chequered background behind images, only visible if they have transparency,
	 * except on main, user, and portal namespaces
	 */
	body:not(.ns-0):not(.ns-2):not(.ns-100) .gallerybox .thumb img {
		background: #fff url(//upload.wikimedia.org/wikipedia/commons/5/5d/Checker-16x16.png) repeat;
	}

	/* Display "From Wikipedia, the free encyclopedia" in skins that support it,
	   do not apply to print mode */
	#siteSub {
		display: block;
	}
}

/* Hide FlaggedRevs notice UI when there are no pending changes */
.flaggedrevs_draft_synced,
.flaggedrevs_stable_synced,
/* "Temporary" to remove links in sidebar T255381 */
#t-upload,
/* Hide broken download box on Special:Book pending T285400 */
.mw-special-Book #coll-downloadbox {
	display: none;
}

/*
 * BELOW HERE THERE BE SOONTOBE TEMPLATESTYLES THINGS;
 * SEE [[MediaWiki talk:Common.css/to do]]
 */

/* Infobox template style */
.infobox {
	border: 1px solid #a2a9b1;
	border-spacing: 3px;
	background-color: #f8f9fa;
	color: black;
	/* @noflip */
	margin: 0.5em 0 0.5em 1em;
	padding: 0.2em;
	/* @noflip */
	float: right;
	/* @noflip */
	clear: right;
	font-size: 88%;
	line-height: 1.5em;
	width: 22em;
}

.infobox-header,
.infobox-label,
.infobox-above,
.infobox-full-data,
.infobox-data,
.infobox-below,
.infobox-subheader,
.infobox-image,
.infobox-navbar,
/* Remove element selector when every .infobox thing is using the standard module/templates  */
.infobox th,
.infobox td {
	vertical-align: top;
}

.infobox-label,
.infobox-data,
/* Remove element selector when every .infobox thing is using the standard module/templates  */
.infobox th,
.infobox td {
	/* @noflip */
	text-align: left;
}

/* Remove .infobox when element selectors above are removed */
.infobox .infobox-above,
.infobox .infobox-title,
/* Remove element selector when every .infobox thing is using the standard module/templates  */
.infobox caption {
	font-size: 125%;
	font-weight: bold;
	text-align: center;
}

.infobox-title,
/* Remove element selector when every .infobox thing is using the standard module/templates  */
.infobox caption {
	padding: 0.2em;
}

/* Remove .infobox when element selectors above are removed */
.infobox .infobox-header,
.infobox .infobox-subheader,
.infobox .infobox-image,
.infobox .infobox-full-data,
.infobox .infobox-below {
	text-align: center;
}

/* Remove .infobox when element selectors above are removed */
.infobox .infobox-navbar {
	/* @noflip */
	text-align: right;
}

/* Normal font styling for wikitable row headers with scope="row" tag */
.wikitable.plainrowheaders th[scope=row],
.wikitable.plainrowheaders th[scope=rowgroup] {
	font-weight: normal;
	/* @noflip */
	text-align: left;
}

/* Remove underlines from certain links */
.nounderlines a,
.IPA a:link,
.IPA a:visited {
	text-decoration: none !important;
}

/* Prevent line breaks in silly places where desired (nowrap)
   and links when we don't want them to (nowraplinks a) */
.nowrap,
.nowraplinks a {
	white-space: nowrap;
}

/* But allow wrapping where desired: */
.wrap,
.wraplinks a {
	white-space: normal;
}

/* texhtml class for inline math (based on generic times-serif class) */
span.texhtml {
	font-family: "Nimbus Roman No9 L", "Times New Roman", Times, serif;
	font-size: 118%;
	line-height: 1;
	white-space: nowrap;
	/* Force tabular and lining display for texhtml */
	font-variant-numeric: lining-nums tabular-nums;
	font-kerning: none;
}

span.texhtml span.texhtml {
	font-size: 100%;
}

@media screen {
	.nochecker .gallerybox .thumb img {
		background-image: none;
	}
}
</style>
`;