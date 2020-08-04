import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { connect } from "react-redux";
import { CardBody } from "/components/default/Card";
import { Filters } from "/components/default/Table";
import { Loader80bots } from "/components/default";
import { flush, open, close } from "/store/fileSystem/actions";
import FileSystem from "/components/default/FileSystem";
import { Select } from "/components/default/inputs";

const rootFolder = "logs";

const FiltersSection = styled(Filters)`
  display: flex;
  align-self: flex-start;
  justify-content: space-between;
`;

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: column nowrap;
  overflow-y: hidden;
  ${props => props.styles};
`;

const LogsTab = ({
  items,
  flush,
  openItem,
  openedFolder,
  openedFile,
}) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(openedFolder);
    if (!openedFolder || !openedFolder.path.startsWith(rootFolder)) {
      openItem({ path: rootFolder }, { limit: 10 });
    }
    return () => flush();
  }, [openedFolder]);

  useEffect(() => {
    const newOptions = items.map(item => {
      item.value = item.name;
      if (item.value === "cloud-init-output") {
        item.label = "Bot Initial";
      } else if (item.value === "log") {
        item.label = "Bot Work";
      } else {
        item.label = item.value;
      }
      return item;
    });
    setOptions(newOptions);
  }, [items]);

  useEffect(() => {
    if (!options.length) return;
    if (!selected) {
      setSelected(options[0]);
    }
  }, [options]);

  useEffect(() => {
    if (!selected) return;
    if (!selected.path.startsWith(rootFolder)) {
      flush();
      setSelected(null);
    } else {
      openItem(selected);
    }
  }, [selected]);

  const onSelected = option => {
    setSelected(option);
  };

  return (
    <>
      <Content>
        {openedFile ? (
          <>
            <FiltersSection>
              <Select
                onChange={onSelected}
                options={options}
                value={selected}
                styles={{
                  select: {
                    container: provided => ({ ...provided, minWidth: "200px" })
                  }
                }}
              />
            </FiltersSection>
            <FileSystem hideNavigator={true} />
          </>
        ) : (
          <Loader80bots
            data={"light"}
            styled={{
              width: "200px"
            }}
          />
        )}
      </Content>
    </>
  );
};

LogsTab.propTypes = {
  items: PropTypes.array.isRequired,
  flush: PropTypes.func.isRequired,
  openItem: PropTypes.func.isRequired,
  openedFolder: PropTypes.object,
  openedFile: PropTypes.object
};

const mapStateToProps = state => ({
  items: state.fileSystem.items,
  openedFile: state.fileSystem.openedFile,
});

const mapDispatchToProps = dispatch => ({
  flush: () => dispatch(flush()),
  openItem: (item, query) => dispatch(open(item, query)),
  closeItem: item => dispatch(close(item))
});

export default connect(mapStateToProps, mapDispatchToProps)(LogsTab);
