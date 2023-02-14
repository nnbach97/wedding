import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
} from "@wordpress/block-editor";
import {
  PanelBody,
  __experimentalInputControl as InputControl,
  SelectControl,
} from "@wordpress/components";
import { Fragment, useEffect, useState } from "@wordpress/element";
import {
  ORDER_BY_FIELD,
  ORDER,
} from "../../config/define";
import { axiosFetch } from "../../services/api-fetch";
import { ConfigBlock, processConfig } from "../../components/config-block";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;
  return (
    <InspectorControls key="settting">
      <PanelBody title="Cấu hình chung" initialOpen={true}>
        <div className="mb-3">
          <InputControl
            value={attributes?.conditon_post.posts_per_page}
            onChange={(value) =>
              setAttributes({
                conditon_post: {
                  ...attributes.conditon_post,
                  posts_per_page: value,
                },
              })
            }
            placeholder="Nhập số lượng bài viết"
            label="Số lượng bài viết:"
          />
        </div>
        <div className="mb-3">
          <SelectControl
            label="Sắp xếp theo"
            value={attributes?.conditon_post.orderby}
            options={ORDER_BY_FIELD}
            onChange={(value) =>
              setAttributes({
                conditon_post: {
                  ...attributes.conditon_post,
                  orderby: value,
                },
              })
            }
          />
        </div>
        <div className="mb-3">
          <SelectControl
            label="Thứ tự sắp xếp"
            value={attributes?.conditon_post.order}
            options={ORDER}
            onChange={(value) =>
              setAttributes({
                conditon_post: {
                  ...attributes.conditon_post,
                  order: value,
                },
              })
            }
          />
        </div>
        <div className="mb-3">
          <SelectControl
            label="Hiển thị bài viết:"
            value={attributes?.conditon_post.highlight_post_only}
            options={[
              {label: "Highlight", value: "1"},
              {label: "All", value: "0"}
            ]}
            onChange={(value) =>
              setAttributes({
                conditon_post: {
                  ...attributes.conditon_post,
                  highlight_post_only: value,
                },
              })
            }
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
  const [dataItem, setDataItem] = useState("");

  useEffect(function () {
    const data = new FormData();
    data.append("action", "get_post_casestudy");
    data.append("nonce", PV_Admin.SECURITY);
    data.append("post_type", "Works");
    data.append("posts_per_page", attributes.conditon_post.posts_per_page);
    data.append("orderby", attributes.conditon_post.orderby);
    data.append("order", attributes.conditon_post.order);
    data.append("highlight_post_only", attributes.conditon_post.highlight_post_only);
    axiosFetch(data).then((res) => {
      let data = res.data;
      if (data.data.html) {
        setDataItem(data.data.html);
      }
    });
  });

  let data = processConfig(attributes.config);
  return (
    <Fragment>
      <div
        className="block block-caseStudy"
        style={data?.style_block || {}}
        dangerouslySetInnerHTML={{ __html: dataItem }}
      ></div>
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
