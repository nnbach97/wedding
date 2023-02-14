import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from "@wordpress/block-editor";
import {
	PanelBody,
	__experimentalInputControl as InputControl,
} from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock, processConfig } from "../../components/config-block";
import { ImageUpload } from "../../components/image-upload";

const Control = function ({ props }) {
	const { attributes, setAttributes } = props;
	return (
		<InspectorControls key="settting">
			<PanelBody title="Cấu hình chung" initialOpen={true}>
				<div className="mb-3">
					<InputControl
						value={attributes.title_shadow}
						onChange={(value) => setAttributes({ title_shadow: value })}
						placeholder="Nhập tiêu đề chìm"
						label="Tiêu đề chìm"
					/>
				</div>
			</PanelBody>
			<PanelBody title="Cấu hình block" initialOpen={true}>
				<ConfigBlock data={attributes} setData={setAttributes} />
			</PanelBody>
		</InspectorControls>
	);
};

const FragmentBlock = function ({ props }) {
	const { attributes, setAttributes } = props;

	let data = processConfig(attributes.config);
	return (
		<Fragment>
			<div className="block block-clients" style={data?.style_block || {}}>
				<div className="holder">
					<div className="title text-center">
						<RichText
							tagName="h3"
							className="ttl"
							value={attributes.title}
							allowedFormats={ALLOWED_FORMATS}
							placeholder="Title"
							keepPlaceholderOnFocus={true}
							onChange={(value) => setAttributes({ title: value })}
						/>
						<span className="shadow">{attributes.title_shadow}</span>
					</div>
					<div class="wrapper-item">
						<div class="item">
							<ImageUpload
								value={attributes?.images}
								multiple={true}
								onChange={(value) => {
									if (!value) return false;
									setAttributes({
										images: value,
									});
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default function Edit(props) {
	return (
		<div {...useBlockProps()}>
			<Control props={props}></Control>
			<FragmentBlock props={props}></FragmentBlock>
		</div>
	);
}
