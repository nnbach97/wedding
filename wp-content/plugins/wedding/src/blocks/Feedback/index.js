import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/feedback", {
	title: "Feedback",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-testimonial",
	attributes: {
		title: {
			type: "string",
			default: "<strong>HEAR FROM OUR USER</strong>",
		},
		title_shadow: {
			type: "string",
			default: "Feedback",
		},
		items: {
			type: "array",
			default: [
				{
					icon: {
						url:
							PV_Admin.PV_BASE_URL +
							"/assets/img/blocks/feedback/feedback_avt.png",
						alt: "",
						id: "",
					},
					text: "wedding is known as an offshore company. There were quite a few offshore vendors exhibiting there, and honestly, it was difficult to decide which company was better. At this time, I had a chance to know and talk with Mr. Tan- Vice President of wedding. I could see that he has a high level of technical capabilities and a fast capability to handle. There’s no doubt that Mr. Tan’s Japanese capability is an important element that made me choose wedding to develop my product.To be honest, I felt that there was a gap in developers’ technical capabilities. But that is covered by other more experienced staff members, even if the program isn’t at a level that meets our requirements. Senior developers can follow instantly.",
					name: "First Inc.",
				},
				{
					icon: {
						url:
							PV_Admin.PV_BASE_URL +
							"/assets/img/blocks/feedback/feedback_avt.png",
						alt: "",
						id: "",
					},
					text: "When developing the project with wedding, although there are many challenges and obstacles when proceeding with the project, you have tried and worked hard with us to overcome them. The time when the project was completed is a deeply moving experience.I hope more and more members can work together to realize new technological innovations. We can see that your company is a good company/organization, please do not lose your kindness and make it become a big company. No matter how technical you are, I want you to keep that kindness.",
					name: "Lecre Inc.",
				},
				{
					icon: {
						url:
							PV_Admin.PV_BASE_URL +
							"/assets/img/blocks/feedback/feedback_avt.png",
						alt: "",
						id: "",
					},
					text: "We have been working on the project together for over a year. We are very grateful because wedding has development speed, abundant knowledge, and capability to foresee the project at the consultation stage.",
					name: "BenefitOne Inc.",
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
	save: () => {
		return <InnerBlocks.Content />;
	},
});
