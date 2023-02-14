import { MediaUpload } from "@wordpress/block-editor";

export function ImageUpload(props) {
	const { onChange, multiple, value, onDelete, label } = props;

	const onSelect = (media) => {
		if (!media) return;
		let images = [];
		if (multiple) {
			media.map((image) => {
				images.push({
					url: image.url,
					alt: image.alt,
					id: image.id,
				});
			});
			return onChange(images);
		}

		images.push({
			url: media.url,
			alt: media.alt,
			id: media.id,
		});
		return onChange(images);
	};

	var image_ids = [];
	if (value && value?.length) {
		value
			.filter((image) => {
				return image?.id;
			})
			.map((image, index) => {
				image_ids.push(image.id);
			});
	}

	let classWrap = "wrapper-images-list";
	if (!multiple) classWrap += " single ";

	return (
		<MediaUpload
			onSelect={onSelect}
			multiple={multiple}
			gallery={multiple}
			value={image_ids}
			render={({ open }) => (
				<div className={classWrap}>
					{label && <h3 className="title">{label}</h3>}
					<div className="images-list">
						{value &&
							value.map((image, index) => {
								return (
									<div className="item" onClick={open}>
										<div className="wrap">
											<img src={image.url} alt={image.url} />
										</div>
									</div>
								);
							})}
						{(!value || multiple) && (
							<div className="item button-add" onClick={open}>
								<div className="wrap">
									<button className="add">
										<span class="dashicons dashicons-plus-alt"></span>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		/>
	);
}

export function ImageUploadSingle(props) {
	const { onChange, value, onDelete, className } = props;

	const onSelect = (media) => {
		if (!media) return;
		let images = {
			url: media.url,
			alt: media.alt,
			id: media.id,
		};
		return onChange(images);
	};

	return (
		<MediaUpload
			onSelect={onSelect}
			multiple={false}
			gallery={false}
			value={value?.id}
			render={({ open }) => (
				<>
					{value?.url && (
						<img
							src={value?.url}
							alt={value?.alt}
							className={className}
							onClick={open}
						/>
					)}
					{!value?.url && (
						<button className="add-media" onClick={open}>
							<span class="dashicons dashicons-format-image"></span>
						</button>
					)}
				</>
			)}
		/>
	);
}
