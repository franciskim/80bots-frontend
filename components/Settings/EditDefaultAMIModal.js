import React, { useEffect, useState } from 'react'
import {
  Col,
  Button,
  Modal,
  Label,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormGroup,
} from 'reactstrap'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { updateRegion } from 'store/bot/actions'
import { NOTIFICATION_TYPES } from 'config'
import { addNotification } from 'lib/helpers'

const EditDefaultAMIModal = ({ isOpen, onClose, region }) => {
  const dispatch = useDispatch()
  const [amis, setAmis] = useState([])
  const [defaultAmi, setDefaultAmi] = useState(null)

  useEffect(() => {
    if (region) {
      setAmis(region.amis)
    }
  }, [region])

  const getCurrentSelect = () => {
    const value = amis.find((item) => {
      return item.image_id === defaultAmi
    })

    return value
      ? { value: value.image_id, label: `${value.name} | ${value.image_id}` }
      : null
  }

  const changeRegionAmi = () => {
    dispatch(updateRegion(region.id, { default_ami: defaultAmi }))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Region ami was successfully ${defaultAmi}`,
        })
        onClose(false)
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Ami update failed',
        })
      )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Edit Default AMI</ModalHeader>
      <ModalBody>
        <FormGroup className="row">
          <Label md={3}>AMI</Label>
          <Col md={9}>
            <Select
              onChange={(option) => setDefaultAmi(option.value)}
              options={amis.map(({ image_id, name }) => ({
                value: image_id,
                label: `${name} | ${image_id}`,
              }))}
              value={getCurrentSelect()}
            />
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={changeRegionAmi}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  )
}

EditDefaultAMIModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  region: PropTypes.object,
}

export default EditDefaultAMIModal
