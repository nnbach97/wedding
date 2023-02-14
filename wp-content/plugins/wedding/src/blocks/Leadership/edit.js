import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock, processConfig } from "../../components/config-block";
import { ImageUpload, ImageUploadSingle } from "../../components/image-upload";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

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
      </PanelBody>
      <PanelBody title="Cấu hình block" initialOpen={true}>
        <ConfigBlock data={attributes} setData={setAttributes} />
      </PanelBody>
    </InspectorControls>
  );
};

const DragHandle = sortableHandle(() => (
  <span className="admin-buttom-move-item btn-about-move">
    <span class="dashicons dashicons-move"></span>
  </span>
));

const SortableItem = SortableElement((props) => {
  const { object, data_key, attributes, setAttributes, handleDelete } = props;
  return (
    <div class="item">
      <DragHandle />
      <button
        onClick={() => handleDelete(data_key)}
        className="admin-buttom-delete-item btn-about-delete"
      >
        <span class="dashicons dashicons-no"></span>
      </button>
      <div class="wrap">
        <ImageUploadSingle
          value={object?.icon}
          onChange={(value) => {
            if (!value) return false;
            let atts = [...attributes?.blocks];
            atts[data_key] = {...object, icon: value};
            setAttributes({ blocks: atts });
          }}
        />
      </div>
      <div class="content">
        <RichText
          tagName="h4"
          className="ttl"
          value={object?.title}
          allowedFormats={ALLOWED_FORMATS}
          placeholder="Họ và tên"
          keepPlaceholderOnFocus={true}
          onChange={(value) => {
            if (!value) return "";
            let atts = [...attributes?.blocks];
            atts[data_key] = {...object, title: value};
            setAttributes({ blocks: atts });
          }}
        />
        <RichText
          tagName="p"
          className="txt"
          value={object?.des}
          allowedFormats={ALLOWED_FORMATS}
          placeholder="Mô tả"
          keepPlaceholderOnFocus={true}
          onChange={(value) => {
            if (!value) return "";
            let atts = [...attributes?.blocks];
            atts[data_key] = {...object, des: value};
            setAttributes({ blocks: atts });
          }}
        />
      </div>
    </div>
  );
});

const SortableList = SortableContainer((props) => {
  const { items, attributes, setAttributes, handleDelete, handleAdd } = props;
  return (
    <div class="wrapper-item">
      {items &&
        items.map((object, index) => {
          return (
            <SortableItem
              key={`item-${index}`}
              value={object}
              object={object}
              index={index}
              data_key={index}
              attributes={attributes}
              setAttributes={setAttributes}
              handleDelete={handleDelete}
            />
          )
        })
      }
      <button className="btn-about-add" onClick={handleAdd}>
        <span class="dashicons dashicons-plus"></span>
      </button>
    </div>
  )
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  const handleAddBlock = () => {
    let list = [...attributes?.blocks];
    list.push({
      icon: {
        id: "",
        url: "",
        alt: ""
      },
      title: "",
      des: ""
    });
    setAttributes({ blocks: list });
  };

  const handleRemoveBlock = (index) => {
    let list = [...attributes?.blocks];
    list.splice(index, 1);
    setAttributes({ blocks: list });
  };

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let blocks = [...attributes?.blocks];
    setAttributes({
      blocks: arrayMoveImmutable(blocks, oldIndex, newIndex),
    });
  };

  let data = processConfig(attributes.config);
  return (
    <Fragment>
      <div
        className="block block-leadership-new "
        style={data?.style_block || {}}
      >
        <div className="holder">
          <div class="title text-center">
            <RichText
              tagName="h3"
              className="ttl"
              value={attributes.title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="Title"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ title: value })}
            />
            <span class="shadow">{attributes.title_shadow}</span>
          </div>
          <SortableList
            items={attributes?.blocks}
            onSortEnd={handlerOnSortEnd}
            axis="xy"
            helperClass="hold-item-leadership"
            hideSortableGhost={true}
            lockOffset={["100%"]}
            useDragHandle
            attributes={attributes}
            setAttributes={setAttributes}
            handleDelete={handleRemoveBlock}
            handleAdd={handleAddBlock}
          />
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
