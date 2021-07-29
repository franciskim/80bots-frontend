import React, { useState, useEffect } from 'react'
import SettingsEditor from './SettingsEditor'
import { useSelector, useDispatch } from 'react-redux'
import { LimitFilter, SearchFilter, Th } from 'components/default/Table'
import {
  Col,
  CardBody,
  Button,
  Table,
  Card,
  Modal,
  Label,
  ModalHeader,
  ModalFooter,
  CardHeader,
  ModalBody,
  FormGroup,
  CardFooter,
} from 'reactstrap'
import { getRegions, updateRegion } from 'store/bot/actions'
import { Paginator } from 'components/default'
import Select from 'react-select'
import { NOTIFICATION_TYPES } from 'config'
import { addNotification } from 'lib/helper'
import { addListener } from 'store/socket/actions'

// const IconButton = styled(Button)`
//   display: inline-flex;
//   justify-content: center;
//   padding: 2px;
//   margin-right: 5px;
//   width: 30px;
//   height: 30px;
//   &:last-child {
//     margin-right: 0;
//   }
// `

// const modalStyles = css`
//   min-width: 300px;
//   overflow-y: visible;
// `

// const ButtonWrap = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   margin-bottom: 5px;
//   button {
//     margin-right: 20px;
//     &:last-child {
//       margin-right: 0;
//     }
//   }
// `

// const selectStyles = {
//   select: {
//     valueContainer: (provided) => ({
//       ...provided,
//       padding: '0 8px',
//       borderColor: '#ced4da',
//     }),
//   },
// }

const Settings = () => {
  const dispatch = useDispatch()
  const [clickedRegion, setClickedRegion] = useState(null)
  const [amis, setAmis] = useState([])
  const [defaultAmi, setDefaultAmi] = useState(null)
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [search, setSearch] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditSettingsModalOpened, setIsEditSettingsModalOpened] =
    useState(false)

  const user = useSelector((state) => state.auth.user)
  const regions = useSelector((state) => state.bot.regions)
  const total = useSelector((state) => state.bot.totalRegions)

  useEffect(() => {
    dispatch(getRegions({ page, limit }))

    dispatch(
      addListener(`regions.${user.id}`, 'RegionsSyncSucceeded', () => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Sync completed',
        })
        dispatch(
          getRegions({
            page,
            limit,
            sort: order.field,
            order: order.value,
            search,
          })
        )
      })
    )
  }, [])

  const toOption = (item) => ({
    value: item.image_id,
    label: `${item.name} | ${item.image_id}`,
  })

  const openEditModal = (region) => {
    setClickedRegion(region)
    setAmis(region.amis)
    setDefaultAmi(region.default_ami)
    setIsModalOpen(true)
  }

  const onModalClose = () => {
    setClickedRegion(null)
    setDefaultAmi(null)
    setAmis([])
  }

  const getCurrentSelect = () => {
    const value = amis.find((item) => {
      return item.image_id === defaultAmi
    })
    return value
      ? { value: value.image_id, label: `${value.name} | ${value.image_id}` }
      : null
  }

  const changeRegionAmi = () => {
    dispatch(updateRegion(clickedRegion.id, { default_ami: defaultAmi }))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Region ami was successfully ${defaultAmi}`,
        })

        setIsModalOpen(false)
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Ami update failed',
        })
      )
  }

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    dispatch(getRegions({ page, limit, sort: field, order: value, search }))
  }

  const OrderTh = (props) => (
    <Th
      {...props}
      order={
        props.field === order.field || props.children === order.field
          ? order.value
          : ''
      }
      onClick={onOrderChange}
    />
  )

  const searchRegions = (value) => {
    setSearch(value)
    dispatch(
      getRegions({
        page,
        limit,
        sort: order.field,
        order: order.value,
        search: value,
      })
    )
  }

  const renderRow = (region) => (
    <tr key={region.id}>
      <td>{region.name}</td>
      <td>{region.code}</td>
      <td>{region.limit}</td>
      <td>{region.created_instances}</td>
      <td>{region.show_default_ami}</td>
      <td>
        <a
          className="table-action"
          href="#"
          title="Edit Region AMI"
          onClick={() => openEditModal(region)}
        >
          <i className="fas fa-edit" />
        </a>
      </td>
    </tr>
  )

  return (
    <Card>
      <CardHeader>
        <Button
          color="primary"
          onClick={() => {
            setIsEditSettingsModalOpened(true)
          }}
        >
          Edit Global Bot Settings
        </Button>
      </CardHeader>
      <CardBody>
        <div>
          <LimitFilter
            id="limitfilter"
            instanceId="limitfilter"
            onChange={({ value }) => {
              setLimit(value)
              getRegions({
                page,
                limit: value,
                sort: order.field,
                order: order.value,
                search,
              })
            }}
          />
          <SearchFilter
            searchProps={{
              onSearch: (value) => {
                searchRegions(value)
              },
            }}
          />
        </div>
        <Table responsive>
          <thead>
            <tr>
              <OrderTh field={'name'}>Name</OrderTh>
              <OrderTh field={'code'}>Code</OrderTh>
              <OrderTh field={'limit'}>Limit</OrderTh>
              <OrderTh field={'used_limit'}>Used Limit</OrderTh>
              <th>Default AMI</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{regions.map(renderRow)}</tbody>
        </Table>
        <Modal isOpen={isModalOpen} onClose={onModalClose}>
          <ModalHeader>Edit Default AMI</ModalHeader>
          <ModalBody>
            <FormGroup className="row">
              <Label md={3}>AMI</Label>
              <Col md={9}>
                <Select
                  onChange={(option) => setDefaultAmi(option.value)}
                  options={amis.map(toOption)}
                  value={getCurrentSelect()}
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button color="primary" onClick={changeRegionAmi}>
              Update
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={isEditSettingsModalOpened}>
          <SettingsEditor
            onClose={() => {
              setIsEditSettingsModalOpened(false)
            }}
          />
        </Modal>
      </CardBody>
      <CardFooter>
        <Paginator
          total={total}
          pageSize={limit}
          onChangePage={(page) => {
            setPage(page)
            dispatch(
              getRegions({
                page,
                limit,
                sort: order.field,
                order: order.value,
                search,
              })
            )
          }}
        />
      </CardFooter>
    </Card>
  )
}

export default Settings
