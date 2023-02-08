import {
	__experimentalInputControl as InputControl,
	__experimentalBoxControl as BoxControl,
	SelectControl,
} from "@wordpress/components";
import { ColorPaletteControl } from "@wordpress/block-editor";
import { GradientPicker } from "@wordpress/components";
import { BACKGROUND } from "../config/define";
import { ImageUpload } from "./image-upload";
import { useState, useEffect } from "@wordpress/element";

export function processConfig(config) {
	if (!config) return {};

	let data = {};
	data.style_block = {};
	if (config?.bg_method == "color" && config?.bg_color) {
		data.style_block.backgroundColor = config?.bg_color;
	}

	if (config?.bg_method == "gradient" && config?.bg_gradient) {
		data.style_block.background = config?.bg_gradient;
	}

	if (config?.bg_method == "image" && config?.bg_image) {
		if (config?.backgroundSize)
			data.style_block.backgroundSize = config?.backgroundSize;
		if (config?.backgroundPosition)
			data.style_block.backgroundPosition = config?.backgroundPosition;
		if (config?.backgroundRepeat)
			data.style_block.backgroundRepeat = config?.backgroundRepeat;
		data.style_block.backgroundImage = "url(" + config?.bg_image[0]?.url + ")";
	}

	if (config?.margin) {
		let margin = config?.margin;
		if (margin?.top) data.style_block.marginTop = margin?.top;
		if (margin?.right) data.style_block.marginRight = margin?.right;
		if (margin?.bottom) data.style_block.marginBottom = margin?.bottom;
		if (margin?.left) data.style_block.marginLeft = margin?.left;
	}

	if (config?.padding) {
		let padding = config?.padding;
		if (padding?.top) data.style_block.paddingTop = padding?.top;
		if (padding?.right) data.style_block.paddingRight = padding?.right;
		if (padding?.bottom) data.style_block.paddingBottom = padding?.bottom;
		if (padding?.left) data.style_block.paddingLeft = padding?.left;
	}

	// console.log(config);

	return data;
}

export function ConfigBlock(props) {
	const { data, setData } = props;

	// const [gradient, setGradient] = useState(null);

	if (data?.config === undefined) return "";

	// useEffect(() => {
	// 	setData({
	// 		config: {
	// 			...data.config,
	// 			bg_gradient: gradient,
	// 		},
	// 	})
	// }, [gradient])

	const BackgroundColor = () => {
		if (data.config?.bg_method != "color") return "";
		return (
			<ColorPaletteControl
				value={data.config?.bg_color}
				onChange={(value) =>
					setData({
						config: {
							...data.config,
							bg_color: value,
						},
					})
				}
			/>
		);
	};

	const BackgroundGradient = () => {
		if (data.config?.bg_method != "gradient") return "";

		return (
			<GradientPicker
				__nextHasNoMargin
				value={data.config?.bg_gradient}
				onChange={(value) =>
					setData({
						config: {
							...data.config,
							bg_gradient: value,
						},
					})
				}
				gradients={[
					{
						name: "JShine",
						gradient:
							"linear-gradient(135deg,#12c2e9 0%,#c471ed 50%,#f64f59 100%)",
						slug: "jshine",
					},
					{
						name: "Moonlit Asteroid",
						gradient:
							"linear-gradient(135deg,#0F2027 0%, #203A43 0%, #2c5364 100%)",
						slug: "moonlit-asteroid",
					},
					{
						name: "Rastafarie",
						gradient:
							"linear-gradient(135deg,#1E9600 0%, #FFF200 0%, #FF0000 100%)",
						slug: "rastafari",
					},
				]}
			/>
		);
	};

	let BACKGROUND_SIZE = [
		{
			label: "Auto",
			value: "auto",
		},
		{
			label: "Contain",
			value: "contain",
		},
		{
			label: "Cover",
			value: "cover",
		},
	];

	let BACKGROUND_POSITION = [
		{
			label: "left top",
			value: "left top",
		},
		{
			label: "left center",
			value: "left center",
		},
		{
			label: "left bottom",
			value: "left bottom",
		},
		{
			label: "center top",
			value: "center top",
		},
		{
			label: "center center",
			value: "center center",
		},
		{
			label: "right top",
			value: "right top",
		},
		{
			label: "right center",
			value: "right center",
		},
		{
			label: "right bottom",
			value: "right bottom",
		},
	];

	let BACKGROUND_REPEAT = [
		{
			label: "No Repeat",
			value: "no-repeat",
		},
		{
			label: "Repeat",
			value: "repeat",
		},
		{
			label: "Repeat X",
			value: "repeat-x",
		},
		{
			label: "Repeat Y",
			value: "repeat-y",
		},
	];

	const BackgroundImage = () => {
		if (data.config?.bg_method != "image") return "";
		return (
			<>
				<ImageUpload
					value={data.config?.bg_image}
					multiple={false}
					onChange={(value) =>
						setData({
							config: {
								...data.config,
								bg_image: value,
							},
						})
					}
				/>
				<div className="mb-3">
					<SelectControl
						label="BACKGROUND SIZE"
						value={data.config?.backgroundSize}
						options={BACKGROUND_SIZE}
						onChange={(value) =>
							setData({
								config: {
									...data.config,
									backgroundSize: value,
								},
							})
						}
					/>
				</div>
				<div className="mb-3">
					<SelectControl
						label="BACKGROUND POSITION"
						value={data.config?.backgroundPosition}
						options={BACKGROUND_POSITION}
						onChange={(value) =>
							setData({
								config: {
									...data.config,
									backgroundPosition: value,
								},
							})
						}
					/>
				</div>
				<div className="mb-3">
					<SelectControl
						label="BACKGROUND REPEAT"
						value={data.config?.backgroundRepeat}
						options={BACKGROUND_REPEAT}
						onChange={(value) =>
							setData({
								config: {
									...data.config,
									backgroundRepeat: value,
								},
							})
						}
					/>
				</div>
			</>
		);
	};

	return (
		<>
			<div className="mb-3">
				<BoxControl
					values={data?.config?.margin}
					label="Margin"
					onChange={(value) =>
						setData({
							config: {
								...data.config,
								margin: value,
							},
						})
					}
				/>
			</div>
			<div className="mb-3">
				<BoxControl
					values={data?.config?.padding}
					label="Padding"
					onChange={(value) =>
						setData({
							config: {
								...data.config,
								padding: value,
							},
						})
					}
				/>
			</div>
			<div className="mb-3">
				<SelectControl
					label="Background"
					value={data.config?.bg_method}
					options={BACKGROUND}
					onChange={(value) =>
						setData({
							config: {
								...data.config,
								bg_method: value,
							},
						})
					}
				/>
			</div>
			<div className="mb-3">
				<BackgroundColor />
				<BackgroundGradient />
				<BackgroundImage />
			</div>
		</>
	);
}
