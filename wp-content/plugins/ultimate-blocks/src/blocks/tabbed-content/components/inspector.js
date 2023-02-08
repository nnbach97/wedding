import {
	horizontalTabIcon,
	verticalTabIcon,
	accordionIcon,
} from "../icons/icon";

const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;
const {
	PanelBody,
	PanelRow,
	ToggleControl,
	RadioControl,
	TextControl,
	ButtonGroup,
	Button,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	constructor(props) {
		super(props);
		this.state = { displayMode: "desktop" };
	}
	render() {
		const { displayMode } = this.state;
		const { attributes, setAttributes } = this.props;
		const {
			activeTab,
			theme,
			normalColor,
			titleColor,
			normalTitleColor,
			tabVertical,
			tabletTabDisplay,
			mobileTabDisplay,
			tabsTitle,
			tabsAnchor,
			useAnchors,
			tabStyle,
		} = attributes;

		const tabColorPanels = [
			{
				value: normalColor,
				onChange: (value) => setAttributes({ normalColor: value }),
				label: __("Tab Color"),
			},
			{
				value: theme,
				onChange: (value) => setAttributes({ theme: value }),
				label: __("Active Tab Color"),
			},
			{
				value: normalTitleColor,
				onChange: (value) => setAttributes({ normalTitleColor: value }),
				label: __("Tab Title Color"),
			},
			{
				value: titleColor,
				onChange: (value) => setAttributes({ titleColor: value }),
				label: __("Active Tab Title Color"),
			},
		];

		return (
			<InspectorControls>
				<PanelBody title={__("Tab style")}>
					<RadioControl
						selected={tabStyle}
						options={["tabs", "pills", "underline"].map((a) => ({
							label: __(a),
							value: a,
						}))}
						onChange={(tabStyle) => setAttributes({ tabStyle })}
					/>
				</PanelBody>
				<PanelColorSettings
					title={__("Tab Colors")}
					initialOpen={true}
					colorSettings={
						tabStyle === "underline" &&
						![tabletTabDisplay, mobileTabDisplay].includes("accordion")
							? tabColorPanels.slice(2)
							: tabColorPanels
					}
				/>
				<PanelBody title={__("Tab Layout")}>
					<PanelRow>
						<label>{__("Mode")}</label>
						<ButtonGroup style={{ paddingBottom: "10px" }}>
							<Button
								icon="desktop"
								showTooltip={true}
								label={__("Desktop")}
								isPressed={displayMode === "desktop"}
								onClick={() => this.setState({ displayMode: "desktop" })}
							/>
							<Button
								icon="tablet"
								showTooltip={true}
								label={__("Tablet")}
								isPressed={displayMode === "tablet"}
								onClick={() => this.setState({ displayMode: "tablet" })}
							/>
							<Button
								icon="smartphone"
								showTooltip={true}
								label={__("Mobile")}
								isPressed={displayMode === "mobile"}
								onClick={() => this.setState({ displayMode: "mobile" })}
							/>
						</ButtonGroup>
					</PanelRow>
					{displayMode === "desktop" && (
						<PanelRow>
							<label>{__("Tab Display")}</label>
							<ButtonGroup>
								<Button
									icon={horizontalTabIcon}
									showTooltip={true}
									label={__("Horizontal")}
									isPressed={!tabVertical}
									onClick={() => setAttributes({ tabVertical: false })}
								/>
								<Button
									icon={verticalTabIcon}
									showTooltip={true}
									label={__("Vertical")}
									isPressed={tabVertical}
									onClick={() => setAttributes({ tabVertical: true })}
								/>
							</ButtonGroup>
						</PanelRow>
					)}
					{displayMode === "tablet" && (
						<PanelRow>
							<label>{__("Tablet Tab Display")}</label>
							<ButtonGroup>
								<Button
									icon={horizontalTabIcon}
									showTooltip={true}
									label={__("Horizontal")}
									isPressed={tabletTabDisplay === "horizontaltab"}
									onClick={() =>
										setAttributes({ tabletTabDisplay: "horizontaltab" })
									}
								/>
								<Button
									icon={verticalTabIcon}
									showTooltip={true}
									label={__("Vertical")}
									isPressed={tabletTabDisplay === "verticaltab"}
									onClick={() =>
										setAttributes({ tabletTabDisplay: "verticaltab" })
									}
								/>
								<Button
									icon={accordionIcon}
									showTooltip={true}
									label={__("Accordion")}
									isPressed={tabletTabDisplay === "accordion"}
									onClick={() =>
										setAttributes({ tabletTabDisplay: "accordion" })
									}
								/>
							</ButtonGroup>
						</PanelRow>
					)}
					{displayMode === "mobile" && (
						<PanelRow>
							<label>{__("Mobile Tab Display")}</label>
							<ButtonGroup>
								<Button
									icon={horizontalTabIcon}
									showTooltip={true}
									label={__("Horizontal")}
									isPressed={mobileTabDisplay === "horizontaltab"}
									onClick={() =>
										setAttributes({ mobileTabDisplay: "horizontaltab" })
									}
								/>
								<Button
									icon={verticalTabIcon}
									showTooltip={true}
									label={__("Vertical")}
									isPressed={mobileTabDisplay === "verticaltab"}
									onClick={() =>
										setAttributes({ mobileTabDisplay: "verticaltab" })
									}
								/>
								<Button
									icon={accordionIcon}
									showTooltip={true}
									label={__("Accordion")}
									isPressed={mobileTabDisplay === "accordion"}
									onClick={() =>
										setAttributes({ mobileTabDisplay: "accordion" })
									}
								/>
							</ButtonGroup>
						</PanelRow>
					)}
				</PanelBody>
				<PanelBody title={__("Tab Anchors")}>
					<ToggleControl
						label={__("Use tab anchors")}
						checked={useAnchors}
						onChange={(useAnchors) => {
							setAttributes({
								useAnchors,
								tabsAnchor: useAnchors ? Array(tabsTitle.length).fill("") : [],
							});
						}}
					/>
					{useAnchors && (
						<TextControl
							label={__("Anchor for current tab")}
							value={tabsAnchor[activeTab]}
							onChange={(newAnchor) =>
								setAttributes({
									tabsAnchor: [
										...tabsAnchor.slice(0, activeTab),
										newAnchor.replace(/\s/g, ""),
										...tabsAnchor.slice(activeTab + 1),
									],
								})
							}
							help={__(
								"Add an anchor text to let the contents of the active tab be accessed directly through a link"
							)}
						/>
					)}
				</PanelBody>
			</InspectorControls>
		);
	}
}
