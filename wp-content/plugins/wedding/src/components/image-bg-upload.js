import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

export function ImageBgUpload(props) {
  const { onChange, handleDeleteImage, value, className } = props;

  return (
    <MediaUploadCheck>
      <MediaUpload
        onSelect={onChange}
        allowedTypes="image"
        render={(obj) => (
          <div
            className={className}
            style={{ padding: value ? "0px" : "30px" }}
          >
            <Button style={value ? { margin: "15px" } : {}} onClick={obj.open}>
              {value ? "Đổi ảnh" : "Chọn ảnh"}
            </Button>
            <Button
              style={
                value
                  ? { display: "inline-block", margin: "15px" }
                  : { display: "none" }
              }
              onClick={handleDeleteImage}
            >
              {"Xóa ảnh"}
            </Button>
            <div class="wrap-img">
              {value ? <img src={value} alt="" /> : ""}
            </div>
          </div>
        )}
      />
    </MediaUploadCheck>
  );
}
