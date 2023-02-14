import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  RichText,
} from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";
import { ImageUploadSingle } from "../../../../components/image-upload";

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <Fragment>
      <div className="block block-product-overview">
        <div className="holder">
          <RichText
            tagName="div"
            className="product-ttl"
            placeholder="Title"
            keepPlaceholderOnFocus={true}
            value={attributes?.title}
            onChange={(value) => {
              setAttributes({title: value})
            }}
          />
          <div class="wrapper">
            <div class="img">
              <ImageUploadSingle
                className="img"
                value={attributes?.image}
                onChange={((value) => {
                  setAttributes({image: value});
                })}
              />
            </div>
            <ul class="list">
              {attributes?.items && attributes?.items.map((item, index) => {
                return (
                  <li className="item">
                    <div class="wrap">
                      <RichText
                        tagName="p"
                        className="ttl"
                        placeholder="Title"
                        keepPlaceholderOnFocus={true}
                        value={item?.ttl}
                        onChange={(value) => {
                          let atts = [...attributes?.items];
                          atts[index] = {...item, ttl: value};
                          setAttributes({items: atts});
                        }}
                      />
                      <RichText
                        tagName="p"
                        className="txt"
                        placeholder="Text"
                        keepPlaceholderOnFocus={true}
                        value={item?.txt}
                        onChange={(value) => {
                          let atts = [...attributes?.items];
                          atts[index] = {...item, txt: value};
                          setAttributes({items: atts});
                        }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default function Edit(props) {
  return (
    <div {...useBlockProps()}>
      <FragmentBlock props={props}></FragmentBlock>
    </div>
  );
}
