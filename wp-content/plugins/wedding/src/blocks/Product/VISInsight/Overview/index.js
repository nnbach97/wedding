import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/visinsight-overview", {
	title: "VISInsight-overview",
	description: "Example block-overview VISInsight",
	category: "wedding",
	icon: "dashicons dashicons-info",

	attributes: {
		title: {
			type: "string",
			default: "Overview VISInsight",
		},
		image: {
			type: "object",
			default: {
				id: "",
				url:
					PV_Admin.PV_BASE_URL +
					"assets/img/blocks/product/product-insight-dt.png",
				alt: "",
			},
		},
		items: {
			type: "array",
			default: [
				{
					ttl: "BOD",
					txt: "View project situation in the company<br>Review, approve necessary documents",
				},
				{
					ttl: "QA",
					txt: "View, monitor project information<br>Support PM completes the target<br>Collect data analysis, build target for the organization",
				},
				{
					ttl: "Software production department",
					txt: "Create procedures for opening and closing projects<br>Create a report<br>Monitoring<br>Resource Management",
				},
				{
					ttl: "IT Support",
					txt: "Decentralization for the project<br>Backup/ recovery’s server folder",
				},
				{
					ttl: "HR",
					txt: "Department information management<br>Employee information management",
				},
				{
					ttl: "Sales",
					txt: "Create customer information<br>Bidding information management",
				},
			],
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
});
