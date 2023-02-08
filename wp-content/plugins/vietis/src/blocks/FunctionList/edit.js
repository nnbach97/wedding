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
import { ConfigBlock } from "../../components/config-block";
import { ALLOWED_FORMATS } from "../../config/define";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <>
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
    </>
  );
};

const DragHandle = sortableHandle(() => (
  <span className="admin-buttom-move-item">
    <span class="dashicons dashicons-move"></span>
  </span>
));

const SortableItem = SortableElement((props) => {
  const { object, data_key, attributes, setAttributes, handleDelete } = props;
  return (
    <li className="item" key={data_key}>
      <button
        onClick={(event) => handleDelete(event, data_key)}
        className="admin-buttom-delete-item"
      >
        <span class="dashicons dashicons-no"></span>
      </button>
      <DragHandle />
      <RichText
        tagName="p"
        className="txt"
        value={object?.text}
        allowedFormats={ALLOWED_FORMATS}
        placeholder="Text"
        keepPlaceholderOnFocus={true}
        onChange={(value) => {
          let atts = [...attributes?.items];
          let newObj = { ...object, text: value };
          atts[data_key] = newObj;
          setAttributes({ items: atts });
        }}
      />
    </li>
  )
});

const SortableList = SortableContainer((props) => {
  const { items, attributes, setAttributes, handleDelete, handleAdd } = props;
  return (
    <ul className="list">
      {items && items.map((object, index) => {
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
      })}
      <li className="item">
        <button class="admin-buttom-add-item" onClick={handleAdd}>
          <span class="dashicons dashicons-plus-alt2"></span>
        </button>
      </li>
    </ul>
  )
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  const handleDelete = (event, index) => {
    event.stopPropagation();
    let atts = [...attributes?.items];
    atts.splice(index, 1);
    setAttributes({ items: atts });
  };

  const handleAdd = () => {
    let atts = [...attributes?.items];
    atts.push({ text: "" });
    setAttributes({ items: atts });
  };

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let items = [...attributes?.items];
    setAttributes({
      items: arrayMoveImmutable(items, oldIndex, newIndex),
    });
  };
  
  return (
    <Fragment>
      <div class="block block-functions">
        <div class="holder">
          <div class="wrapper">
            <RichText
              tagName="h3"
              className="title"
              value={attributes?.title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="description"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ title: value })}
            />

            <SortableList
              items={attributes?.items}
              onSortEnd={handlerOnSortEnd}
              axis="xy"
              helperClass="hold-item-function"
              hideSortableGhost={true}
              lockOffset={["100%"]}
              useDragHandle
              attributes={attributes}
              setAttributes={setAttributes}
              handleDelete={handleDelete}
              handleAdd={handleAdd}
            />
          </div>
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
