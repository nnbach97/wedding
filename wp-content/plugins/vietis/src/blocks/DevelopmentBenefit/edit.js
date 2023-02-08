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
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { ImageUploadSingle } from "../../components/image-upload";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <>
      <InspectorControls key="settting">
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
    <div class="item">
      <button
        onClick={() => handleDelete(data_key)}
        className="admin-buttom-delete-item"
      >
        <span class="dashicons dashicons-no"></span>
      </button>
      <DragHandle />
      <ImageUploadSingle
        className="img"
        value={object?.icon}
        onChange={(value) => {
          let atts = [...attributes?.items];
          let item = {...object, icon: value};
          atts[data_key] = item;
          setAttributes({items: atts});
        }}
      />

      <div class="content">
        <RichText
          tagName="p"
          className="ttl"
          value={object?.title}
          placeholder="Enter Title.."
          keepPlaceholderOnFocus={true}
          onChange={(value) => {
            let atts = [...attributes?.items];
            let item = {...object, title: value};
            atts[data_key] = item;
            setAttributes({items: atts});
          }}
        />
        <RichText
          tagName="p"
          className="txt"
          value={object?.txt}
          placeholder="Enter Content.."
          keepPlaceholderOnFocus={true}
          onChange={(value) => {
            let atts = [...attributes?.items];
            let item = {...object, txt: value};
            atts[data_key] = item;
            setAttributes({items: atts});
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

      <div className="item button-add">
        <div className="wrap">
          <button
            onClick={() => handleAdd()}
            className="admin-buttom-add-item"
          >
            <span class="dashicons dashicons-plus-alt2"></span>
          </button>
        </div>
      </div>
    </div>
  );
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  const handlerAdd = () => {
    let atts = [...attributes?.items];
    atts.push({
      icon: {
        url: "",
        alt: "",
        id: ""
      },
      title: "",
      txt: "",
    });
    setAttributes({items: atts});
  };

  const handleDelete = (index) => {
    let atts = [...attributes?.items];
    atts.splice(index, 1);
    setAttributes({items: atts});
  }

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let items = [...attributes?.items];
    setAttributes({
      items: arrayMoveImmutable(items, oldIndex, newIndex),
    });
  };

  return (
    <Fragment>
      <div class="block block-development-benefit">
        <div class="holder">
            <SortableList
              items={attributes?.items}
              onSortEnd={handlerOnSortEnd}
              axis="xy"
              helperClass="hold-item-benefit"
              hideSortableGhost={true}
              lockOffset={["100%"]}
              useDragHandle
              attributes={attributes}
              setAttributes={setAttributes}
              handleDelete={handleDelete}
              handleAdd={handlerAdd}
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
