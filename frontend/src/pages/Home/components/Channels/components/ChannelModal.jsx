import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik'
import { useEffect, useMemo, useRef } from 'react'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

import leoProfanity from 'leo-profanity'
leoProfanity.loadDictionary('ru')

const ChannelModal = ({ show, handleClose, modalType, channelData, handleSave, channelsList }) => {
  const { t } = useTranslation()

  const initialValues = useMemo(
    () => ({
      name: channelData ? channelData.name : '',
      id: channelData ? channelData.id : null,
    }),
    [channelData]
  )

  const validationSchema =
    modalType === 'delete'
      ? null
      : Yup.object({
          name: Yup.string()
            .required(t('required'))
            .min(3, t('passwordLengthError'))
            .max(20, t('passwordLengthError'))
            .test('unique-name', t('channelNameExistError'), (value) => {
              const channelNames = channelsList.map((channel) => channel.name.toLowerCase())
              return !channelNames.includes(value.toLowerCase())
            }),
        })

  const handleSubmit = (values, { setSubmitting }) => {
    const cleanName = leoProfanity.clean(values.name)
    handleSave(modalType, cleanName, values.id)
    setSubmitting(false)
  }

  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current && modalType !== 'delete') {
      inputRef.current.focus()
    }
  }, [show, modalType])

  useEffect(() => {
    if (modalType === 'delete' && show) {
      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          handleSave(modalType, initialValues.name, initialValues.id)
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [show, modalType, initialValues, handleSave])

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === 'delete'
            ? t('removeChannel')
            : modalType === 'edit'
            ? t('renameChannel')
            : t('addChannel')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <FormikForm onSubmit={handleSubmit}>
              {modalType === 'delete' ? (
                <p>{t('sureYouWantToDelete')}?</p>
              ) : (
                <Form.Group controlId="formChannelName">
                  <Form.Label hidden>Имя канала</Form.Label>
                  <Field
                    name="name"
                    type="text"
                    placeholder={t('enterNameChannel')}
                    className="form-control"
                    innerRef={inputRef}
                  />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </Form.Group>
              )}
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  {t('cancel')}
                </Button>
                <Button variant={modalType === 'delete' ? 'danger' : 'primary'} type="submit">
                  {modalType === 'delete' ? t('delete') : t('send')}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default ChannelModal