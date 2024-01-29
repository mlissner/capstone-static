import { LitElement, html, css, unsafeHTML, nothing } from "../lib/lit.js";

import { fetchCaselawBody, fetchCaseMetadata } from "../lib/data.js";

export default class CapCase extends LitElement {
	static properties = {
		caseBody: { attribute: false },
		caseMetadata: { attribute: false },
		reporter: { type: String },
		volume: { type: String },
		case: { type: String },
	};

	static styles = [
		css`
			/**/
			/* Styles for HTML under our control */
			/**/

			/* .case-container */

			.case-container {
				flex: 0 0 83.33333%;
				max-width: 83.33333%;
				margin: auto;

				padding-top: 0;
				padding-bottom: 100px;

				/*	styles inherited from "body" in capstone */

				letter-spacing: 0.01em;
				font-size: 20px;
				font-weight: normal;
				line-height: 29px;
				color: var(--color-gray-500);
				-moz-osx-font-smoothing: grayscale;
				-webkit-font-smoothing: antialiased;
				-webkit-hyphens: auto;
				-moz-hyphens: auto;
				-ms-hyphens: auto;
				hyphens: auto;
			}

			/* .case-header */

			.case-header {
				font-size: 0.9em;
				font-family: var(--font-serif-titling);
				text-align: center;
				padding: 2em 2em 0;
			}

			@media (min-width: 992px) {
				.case-header {
					padding: 0;
				}

				.case-header::after {
					content: '*';
					color: var(--color-gray-000);
				}
			}

			.case-header > h1 {
				font-family: var(--font-serif-titling);
				font-weight: 700;
				font-size: 1.3em;
				line-height: 1.4em;
				padding: 0;
				margin: 0;
			}

			.case-header .decision-date, .case-header .court-name {
				line-height: 1.4em;
			}

			.case-header .citations {
				line-height: 2em;
			}

			/* .metadata */

			.metadata {
				flex: 0 0 83.33333%;
				max-width: 83.33333%;
				margin: auto;
			}

			.metadata .case-name {
				flex: 0 0 66.66667%;
				max-width: 66.66667%;
				margin-left: 16.66667%;
				font-family: var(--font-serif);
				text-align: center
			}

			.metadata .case-name .case-name-v {
				display: block;
				margin: .5em;
				font-style: italic;
			}

			/**/
			/* Styles that apply to the injected HTML */
			/**/

			/* .casebody */

			.casebody {
				padding-top: 1em;
			}

			.casebody section, .casebody article {
				flex: 0 0 83.33333%;
				max-width: 83.33333%;
				margin: auto;
				padding-top: 1em;
			}

			.casebody img {
				max-width: 100%;
				height: auto;
			}

			.casebody section {
				position: relative;
			}

			.casebody p {
				font-family: var(--font-serif);
				margin-top: 1.25rem;
				margin-bottom: 0;
			}

			.casebody p.small-text {
				font-family: var(--font-serif);
				font-size: 14px;
				font-weight: 600;
			}

			.casebody blockquote {
				font-family: var(--font-serif);
				margin-left: 0;
				padding: .5rem 1rem .5rem 1rem;
				border-left: 0.5rem solid var(--color-gray-000);
				color: var(--color-blue-500);
				font-size: 0.875rem;
				line-height: 1.5;
			}

			.head-matter > *, .opinion > * {
				position: relative;
			}

			section.head-matter {
				padding-bottom: 0;
				font-size: 1rem;
				line-height: 1.5;
			}

			section.head-matter p.summary, section.head-matter p.history, section.head-matter p.headnotes, section.head-matter p.disposition, section.head-matter p.syllabus, section.head-matter p.attorneys, section.head-matter aside.summary, section.head-matter aside.history, section.head-matter aside.headnotes, section.head-matter aside.disposition, section.head-matter aside.syllabus, section.head-matter aside.attorneys {
				margin-bottom: 0;
				margin-top: 0;
				background-color: var(--color-gray-100);
				padding: 0rem 2rem 1rem 2rem;
			}

			section.head-matter :not(.headnotes) + .headnotes:before, section.head-matter :not(.summary) + .summary:before, section.head-matter :not(.history) + .history:before,
			section.head-matter :not(.syllabus) + .syllabus:before, section.head-matter :not(.disposition) + .disposition:before, section.head-matter :not(.attorneys) + .attorneys:before {
				padding-left: 0;
				font-family: var(--font-sans-titling);
				font-weight: bold;
				color: var(--color-gray-000);
				word-break: break-all;
				text-align: left;
				font-size: 1rem;
				text-transform: uppercase;
				position: absolute;
				top: 1rem;
				content: attr(class);
			}

			section.head-matter :not(.footnote) + .footnote:before {
				padding-left: 0;
				font-family: var(--font-sans-titling);
				font-weight: bold;
				color: var(--color-gray-000);
				word-break: break-all;
				text-align: left;
				font-size: 1rem;
				text-transform: uppercase;
				position: absolute;
				top: 1rem;
				content: "Head Matter Footnotes";
			}

			section.head-matter :not(.headnotes) + .headnotes, section.head-matter :not(.summary) + .summary, section.head-matter :not(.history) + .history,
			section.head-matter :not(.syllabus) + .syllabus, section.head-matter :not(.disposition) + .disposition, section.head-matter :not(.attorneys) + .attorneys,
			section.head-matter :not(.footnote) + .footnote {
				margin-top: 1rem;
				padding-bottom: 1rem;
				padding-top: 3rem;
			}

			section.head-matter .page-label:before {
				display: none;
			}

			section.head-matter .footnote {
				margin-bottom: 0;
				margin-top: 0;
				background-color: var(--color-gray-100);
				padding: 0rem 2rem 1rem 2rem;
			}

			section.head-matter .footnote > p, section.head-matter footnote > blockquote {
				padding-bottom: .5em;
				margin-bottom: 0;
			}

			/* hidden, because this information is otherwise displayed on the page */
			.parties, .docketnumber, .decisiondate {
				display: none;
			}

			.attorneys, .judges {
				text-align: left;
				font-size: 1.25rem;
			}

			.author {
				font-size: 1.25rem;
				color: var(--color-purple-200);
			}

			.author:before {
				content: "Author: ";
				color: var(--color-gray-500);
			}

			.opinion {
				padding-top: 2em;
			}

			.opinion:before {
				content: "Opinion";
				font-weight: bold;
				font-family: var(--font-serif-titling);
			}

			.opinion > p {
				margin-bottom: 15px;
			}

			.footnotemark {
				border-bottom: 0;
				margin-bottom: 5px;
				color: var(--color-purple-200);
				vertical-align: super;
				font-size: .75rem;
				font-weight: bold; }

			.footnote {
				font-size: 0.875rem;
				line-height: 1.5;
				padding: 0rem 2rem 1rem 2rem;
				line-height: 1.5;
				position: relative;
			}

			.footnote > p, .footnote > blockquote {
				margin-bottom: .5em;
				margin-top: 0;
			}

			.footnote > a {
				position: absolute;
				left: .5rem;
				border-bottom: 0;
				font-weight: 700;
				color: var(--color-purple-200);
				font-family: var(--font-serif);
				font-size: .75rem;
			}

			.footnote:target {
				background-color: var(--color-pink-000);
			}

			.footnote .page-label:before {
				display: none;
				text-align: left;
			}

			.page-label {
				color: var(--color-gray-000);
				font-size: .8em;
				padding: .4em;
				font-style: italic;
			}

			.page-label:before {
				display: inline-block;
				content: attr(data-label);
				position: absolute;
				left: 0;
				transform: translateX(-100%);
				padding-right: 1em;
				font-size: 1.2rem;
			}
		`
	]

	constructor() {
		super();
		this.caseBody = "";
		this.caseMetadata = {};
	}

	connectedCallback() {
		super.connectedCallback();
		fetchCaselawBody(
			this.reporter,
			this.volume,
			this.case,
			(data) => (this.caseBody = data),
		);

		fetchCaseMetadata(
			this.reporter,
			this.volume,
			this.case,
			(data) => (this.caseMetadata = data),
		);
	}

	getDocketNumber() {
		if (true){
			return html`
				<span>&middot;</span>
				<span class="docket-number">Docket Number</span>
			`;
		} else {
			return nothing;
		}
	}

	render() {
		/*
		This render method uses requestAnimationFrame to alter the links in
		the shadow DOM once it's been rendered to change the logical links
		to cited cases in the archived html to links to the presentation
		layer version of the case.
		*/

		// Skip the first frame which is the shadow DOM render
		const doNothing = () => {};
		// Rewrite the links on the second frame
		const rewriteLinks = () => {
			this.shadowRoot.querySelectorAll("a").forEach((a) => {
				const oldLink = a.getAttribute("href");
				//todo we need to fix this when ENG-523 happens
				// (and we should make sure we don't break footnotes when we do)
				a.href = oldLink + "#todo";
			});
		};
		window.requestAnimationFrame(doNothing);
		window.requestAnimationFrame(rewriteLinks);
		return html`
			<div class="case-container">
				<div class="case-header">
					<h1>Case's Full Citation</h1>
					<div>
						<span class="decision-date">Formatted Decision Date</span>
						<span>&middot;</span>
						<span class="court-name">Court Name</span>
						${this.getDocketNumber()}
					</div>
					 <div class="citations">
						Citation, Citation, Citation
					</div>
				</div>
				<div class="metadata">
					<div class="case-name">
						SOMEBODY
						<span class="case-name-v">v.</span>
						SOMEBODY ELSE
					</div>
				</div>
				<!--section.casebody -->
				${unsafeHTML(this.caseBody)}
			</div>
		`;
	}
}

customElements.define("cap-case", CapCase);
