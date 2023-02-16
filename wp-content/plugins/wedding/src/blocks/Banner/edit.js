import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from "@wordpress/block-editor";
import { PanelBody, Panel, FormToggle } from "@wordpress/components";
import { Fragment, useEffect, useState } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock, processConfig } from "../../components/config-block";
import { ImageUploadSingle } from "../../components/image-upload";
import { VideoUploadSingle } from "../../components/video-upload";

const Control = function ({ props }) {
	const { attributes, setAttributes } = props;
	const [isChecked, setChecked] = useState(true);

	useEffect(() => {
		setAttributes({ is_show_btn_video: isChecked });
	}, [isChecked]);

	return (
		<>
			<InspectorControls key="settting">
				<PanelBody title="Cấu hình chung" initialOpen={true}>
					<div className="mb-3 horizontal-wrap">
						<h2 className="ttl">Show button video:</h2>
						<FormToggle
							checked={isChecked}
							onChange={() => setChecked((state) => !state)}
						/>
					</div>

					<div className="mb-3">
						<Panel header="Video Background">
							<VideoUploadSingle
								value={attributes.video_background}
								className="video-wrap"
								onChange={(media) => {
									setAttributes({ video_background: media.url });
								}}
								handleDeleteVideo={() =>
									setAttributes({ video_background: "" })
								}
							/>
						</Panel>
					</div>

					<div className="mb-3">
						<Panel header="Video Film">
							<VideoUploadSingle
								value={attributes.video_film}
								className="video-wrap"
								onChange={(media) => {
									setAttributes({ video_film: media.url });
								}}
								handleDeleteVideo={() => setAttributes({ video_film: "" })}
							/>
						</Panel>
					</div>
				</PanelBody>
				<PanelBody title="Cấu hình block" initialOpen={true}>
					<ConfigBlock data={attributes} setData={setAttributes} />
				</PanelBody>
			</InspectorControls>
		</>
	);
};

const FragmentBlock = function ({ props }) {
	const { attributes, setAttributes } = props;
	let data = processConfig(attributes.config);
	return (
		<Fragment>
			<div className="block block-banner js-hero">
				<div className="overlay" style={data?.style_block || {}}></div>
				<div className="banner-bg">
					<video
						className="video"
						preload="true"
						muted=""
						playsinline=""
						poster=""
						autoplay=""
						loop=""
						controls=""
					>
						<source src={attributes.video_background} type="video/mp4" />
					</video>
				</div>
				<div className="holder banner-inner">
					<div className="wrap">
						<RichText
							tagName="h2"
							className="ttl"
							value={attributes.title}
							allowedFormats={ALLOWED_FORMATS}
							placeholder="In Pursuit of Excellent"
							keepPlaceholderOnFocus={true}
							onChange={(value) => setAttributes({ title: value })}
						/>
						<RichText
							tagName="p"
							className="sub"
							value={attributes?.description}
							allowedFormats={ALLOWED_FORMATS}
							placeholder="Ngọc Bách & Huyền Trang"
							keepPlaceholderOnFocus={true}
							onChange={(value) => setAttributes({ description: value })}
						/>
						<div className="btn-wrapper">
							{attributes.is_show_btn_video ? (
								<div className="item">
									<span className="icon">
										<ImageUploadSingle
											value={attributes?.btn_watch?.icon}
											className="img"
											onChange={(value) => {
												if (!value) return false;
												setAttributes({
													btn_watch: {
														...attributes?.btn_watch,
														icon: value,
													},
												});
											}}
										/>
									</span>
									<RichText
										tagName="span"
										className="url"
										value={attributes.btn_watch?.text}
										allowedFormats={ALLOWED_FORMATS}
										placeholder="Watch vision film"
										keepPlaceholderOnFocus={true}
										onChange={(value) =>
											setAttributes({
												btn_watch: {
													...attributes?.btn_watch,
													text: value,
												},
											})
										}
									/>
								</div>
							) : (
								""
							)}
							<div className="item">
								<span className="icon">
									<ImageUploadSingle
										value={attributes?.btn_inquiry?.icon}
										className="img"
										onChange={(value) => {
											if (!value) return false;
											setAttributes({
												btn_inquiry: {
													...attributes?.btn_inquiry,
													icon: value,
												},
											});
										}}
									/>
								</span>
								<RichText
									tagName="span"
									className="url"
									value={attributes.btn_inquiry?.text}
									allowedFormats={ALLOWED_FORMATS}
									placeholder="Inquiry"
									keepPlaceholderOnFocus={true}
									onChange={(value) =>
										setAttributes({
											btn_inquiry: {
												...attributes?.btn_inquiry,
												text: value,
											},
										})
									}
								/>
							</div>
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
