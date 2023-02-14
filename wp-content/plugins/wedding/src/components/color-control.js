import { ColorPaletteControl } from "@wordpress/block-editor";
// import { useState, useEffect } from "@wordpress/element";
import { Button, Dropdown } from "@wordpress/components";

export function BaseColorControl(props) {
	const { onChange, value, position, colors } = props;

	return (
		<div className="admin-color-control" style={{ "--color": value }}>
			<Dropdown
				contentClassName="admin-wrap"
				position={position ? position : "bottom right"}
				renderToggle={({ isOpen, onToggle }) => {
					return (
						<Button
							className="button-color"
							variant="primary"
							onClick={onToggle}
							aria-expanded={isOpen}
						></Button>
					);
				}}
				renderContent={() => (
					<ColorPaletteControl
						colors={colors}
						value={value}
						onChange={(value) => onChange(value)}
					/>
				)}
			/>
		</div>
	);
}
