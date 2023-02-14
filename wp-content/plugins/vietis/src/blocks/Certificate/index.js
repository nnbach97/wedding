import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/certificate", {
	title: "Certificate",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-welcome-learn-more",
	attributes: {
		config: {
			type: "object",
			default: {
				bg_method: "color",
				bg_color: "rgba(18, 51, 111, 1)",
			},
		},
		items: {
			type: "array",
			default: [
				{
					image: {
						url:
							PV_Admin.PV_BASE_URL +
							"/assets/img/blocks/certificate/certificate_img01.png",
						alt: "",
						id: "",
					},
					ttl: "<strong>ISO 27001 Certification System</strong>",
					txt: "This is a system to certify businesses that have established an information security management system (ISMS) that meets the requirements of ISO27001, appropriately implement control measures for information security, and properly manage risks. Businesses certified by a certification body are permitted to use “ISO27001”.",
					color: "#fff",
				},
				{
					image: {
						url:
							PV_Admin.PV_BASE_URL +
							"/assets/img/blocks/certificate/certificate_img02.png",
						alt: "",
						id: "",
					},
					ttl: "<strong>CMMI Level 3 Certificate</strong>",
					txt: "Based on the CMMI (the system development organization’s process improvement model and evaluation methodology), the entire organization worked to improve the software development process and reached Level 3 in February 2019.",
					color: "#fff",
				},
			],
		},
		img_background: {
			type: "string",
			default:
				PV_Admin.PV_BASE_URL +
				"/assets/img/blocks/certificate/certificate_bg.png",
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
