import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
  InnerBlocks,
} from "@wordpress/block-editor";
import {
  PanelBody,
  __experimentalInputControl as InputControl,
  SelectControl,
} from "@wordpress/components";
import { Fragment, useEffect, useState } from "@wordpress/element";
import {
  POSTTYPE_POST,
  ORDER_BY_FIELD,
  ORDER,
  ALLOWED_FORMATS,
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
            value={attributes.title_shadow}
            onChange={(value) => setAttributes({ title_shadow: value })}
            placeholder="Nhập tiêu đề chìm"
            label="Tiêu đề chìm"
          />
        </div>
        <div className="mb-3">
          <InputControl
            value={attributes.conditon_post.posts_per_page}
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
            label="PostType"
            value={attributes.conditon_post.post_type}
            options={POSTTYPE_POST}
            onChange={(value) =>
              setAttributes({
                conditon_post: {
                  ...attributes.conditon_post,
                  post_type: value,
                },
              })
            }
          />
        </div>
        <div className="mb-3">
          <SelectControl
            label="Sắp xếp theo"
            value={attributes.conditon_post.orderby}
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
            value={attributes.conditon_post.order}
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
  useEffect(
    function () {
      const data = new FormData();
      data.append("action", "get_post");
      data.append("nonce", PV_Admin.SECURITY);
      data.append("post_type", attributes.conditon_post.post_type);
      data.append("posts_per_page", attributes.conditon_post.posts_per_page);
      data.append("orderby", attributes.conditon_post.orderby);
      data.append("order", attributes.conditon_post.order);
      axiosFetch(data).then((res) => {
        let data = res.data;
        if (data.data.html) {
          setDataItem(data.data.html);
        }
      });
    },
    [
      attributes.conditon_post.post_type,
      attributes.conditon_post.posts_per_page,
      attributes.conditon_post.orderby,
      attributes.conditon_post.order,
      setDataItem,
    ]
  );

  let data = processConfig(attributes.config);

  return (
    <Fragment>
      <div className="block block-services" style={data?.style_block || {}}>
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
          <div class="block-content">
            <InnerBlocks allowedBlocks={{}} />
          </div>
          <div
            class="wrapper-item"
            dangerouslySetInnerHTML={{ __html: dataItem }}
          ></div>
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
