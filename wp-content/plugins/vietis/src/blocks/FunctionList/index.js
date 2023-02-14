import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/function", {
	title: "Function List",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-text",

	attributes: {
		title: {
			type: "string",
			default: "<strong>Function list</strong>",
		},
		items: {
			type: "array",
			default: [
				{
					text: "Manager Project Bidding",
				},
				{
					text: "Weekly Report",
				},
				{
					text: "Project Opening (submit, review, approve)",
				},
				{
					text: "Resource Reports",
				},
				{
					text: "Redmine members Synchronize",
				},
				{
					text: "OT Registration",
				},
				{
					text: "Estimation Importing",
				},
				{
					text: "Members Management",
				},
				{
					text: "Requirements Importing",
				},
				{
					text: "Departments Management",
				},
				{
					text: "Requirements Synchronization",
				},
				{
					text: "Project Opening Decision",
				},
			],
		},
	},
	example: {},
	getEditWrapperProps() {
		return { "data-align": "full" };
	},
	edit: Edit,
});
