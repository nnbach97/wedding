import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  RichText,
  InnerBlocks
} from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";
import {
  processConfig,
} from "../../../../components/config-block";
import { ALLOWED_FORMATS } from "../../../../config/define";

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <Fragment>
      <div className="block block-veramine-overview">
        <div class="feature">
          <div class="holder">
            <div class="wrap">
              <RichText 
                tagName="h3"
                className="product-ttl product-ttl--line"
                value={attributes?.title}
                allowedFormats={ALLOWED_FORMATS}
                placeholder="Title"
                onChange={(value) => {
                  setAttributes({title: value});
                }}
              />
              <div className="inner-blocks">
                <InnerBlocks allowedBlocks={{}} />
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
      <FragmentBlock props={props}></FragmentBlock>
    </div>
  );
}
