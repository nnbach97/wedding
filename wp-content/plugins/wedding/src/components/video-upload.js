import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

export function VideoUploadSingle(props) {
  const { onChange, handleDeleteVideo, value, className } = props;

  return (
    <MediaUploadCheck>
      <MediaUpload
        onSelect={onChange}
        allowedTypes="video"
        render={(obj) => (
          <div
            className={className}
            style={{padding: value ? "0px" : "30px"}}
          >
            <Button style={value ? { margin: "15px" } : {}} onClick={obj.open}>
              {value ? "Đổi video" : "Chọn video"}
            </Button>
            <Button
              style={value ? { display: "inline-block", margin: "15px" } : { display: "none" }}
              onClick={handleDeleteVideo}
            >
              {"Xóa video"}
            </Button>
            {value ? (
              <video controls>
                <source src={value} type="video/mp4" />
              </video>
            ) : (
              ""
            )}
          </div>
        )}
      />
    </MediaUploadCheck>
  );
}
