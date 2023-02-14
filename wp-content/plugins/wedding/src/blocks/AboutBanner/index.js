import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/about-banner", {
	title: "Banner-about",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-info",
	attributes: {
		ttl: {
			type: "string",
			default: "<strong>About us</strong>",
		},
		txt: {
			type: "string",
			default:
				"We are very grateful for working with you.<br><br>Our company wedding was established in 2009 in Hanoi, focusing on thehighly demanding quality markets such as Japanese and APAC. Wealways work hard, highly disciplined to provide reliable offshoresoftware services at affordable cost but high quality. We are offeringseveral services: <strong>Application Development/Maintenance, DigitalTransformation, UI/UX Design, Engineer Dispatch.</strong><br><br>Our broad experience allows us to create many type applications inmany type of platforms with front-end, web, mobile technologies andprogramming languages such as Java, PHP, Java Scripts, .NET, NodeJS ...and back-end enterprise applications, cloud computing solution withAWS, Microsoft Azure, Google Cloud. We have many engineers speakinggood Japanese, English to work with you from early stages of project asrequirement hearing, UI/ UX design to later stages as detailed design,coding, testing and deployment.<br><br><strong>We are looking forward to becoming your trusted tech- partner, wefeel happy and excited to see your products succeed on the marketand we are always available to support you.</strong>",
		},
		role: {
			type: "string",
			default: "CEO <strong>Dang Dieu Linh</strong>",
		},
		config: {
			type: "object",
			default: {},
		},
	},
	example: {},
	getEditWrapperProps() {
		return { "data-align": "full" };
	},
	edit: Edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
