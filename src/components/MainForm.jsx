import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import { Spinner } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { LabelContent, InvalidFeedback } from './Display';

export default function MainForm({ data, loaded, ref }) {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        getValues,
        trigger,
        formState: { errors, touchedFields }
    } = useForm({
        mode: "onBlur", reValidateMode: "onChange", defaultValues: data
    });

    useEffect(() => {
        reset(data);
    }, [data, reset]);

    const validate = async () => {
        const isValid = await trigger();
        return isValid;
    }

    const getData = () => getValues();

    const showMessage = (type, content) => {
        console.log(content);
    }

    useImperativeHandle(ref, () => {
        return {
            validate, getData, showMessage
        };
    }, []);

    const required = () => {
        return { required: 'Este campo é obrigatório.' };
    };

    const formData = watch();

    if (!loaded) {
        return (
            <div className="p-3">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Form noValidate onSubmit={handleSubmit(() => {})}>
            <Row className="mt-2 mb-2">
                <Col className="d-flex align-items-start">
                    <h4 style={{ color: 'black' }}><strong><em>Solicitação</em></strong></h4>
                </Col>
            </Row>
            <Row className="g-3">
                <Col lg="4">
                    <FloatingLabel label="Tipo de solicitação" controlId="tipoSolicitacao">
                        <Form.Select
                            {...register('tipoSolicitacao', {
                                validate: {
                                    tipo: (tipo) => {
                                        if (tipo === '1') {
                                            return true;
                                        }

                                        return 'O tipo de solicitação 2 não pode ser selecionado.';
                                    }
                                }
                            })}
                            isInvalid={errors.tipoSolicitacao}
                        >
                            <option value="1">1 - Aprovação de remessas de NF-e</option>
                            <option value="2">2 - Aprovação de contrato</option>
                        </Form.Select>
                        <InvalidFeedback message={errors.tipoSolicitacao?.message} />
                    </FloatingLabel>
                </Col>
                <Col lg="2">
                    <FloatingLabel label="Número" controlId="numeroRemessa">
                        <Form.Control
                            type="text"
                            placeholder="Número"
                            {...register('numeroRemessa', {
                                required: 'abcde',
                                validate: {
                                    tipo: (numeroRemessa, { tipoSolicitacao }) => {
                                        if (tipoSolicitacao === '1') {
                                            return 'Errado';
                                        }

                                        return true;
                                    }
                                }
                            })}
                            required
                            isInvalid={errors.numeroRemessa}
                        //isValid={touchedFields.numeroRemessa && !errors.numeroRemessa}
                        />
                        <InvalidFeedback message={errors.numeroRemessa?.message} />
                    </FloatingLabel>
                </Col>
                <Col lg="2">
                    <FloatingLabel label="Data">
                        <Form.Control
                            id="dataRemessa"
                            name="dataRemessa"
                            type="date"
                            placeholder="Data"
                        />
                    </FloatingLabel>
                </Col>
                <Col lg="2">
                    <FloatingLabel label="Quantidade de notas">
                        <Form.Control
                            id="quantidadeNotasRemessa"
                            name="quantidadeNotasRemessa"
                            type="text"
                            placeholder="Quantidade de notas"
                        />
                    </FloatingLabel>
                </Col>
                <Col lg="2">
                    <FloatingLabel label={
                        <LabelContent label="Categoria" tooltip="Categoria da remessa com base em seu valor ( <= 1000 = baixo valor, > 1000 = alto valor)"></LabelContent>
                    }>
                        <Form.Control
                            id="categoriaRemessa"
                            name="categoriaRemessa"
                            type="text"
                            placeholder="Categoria"
                        />
                    </FloatingLabel>
                </Col>
                <Col lg="2">
                    <FloatingLabel label="Valor total">
                        <Form.Control
                            id="valorTotalRemessa"
                            name="valorTotalRemessa"
                            type="text"
                            placeholder="Valor total"
                        />
                    </FloatingLabel>
                </Col>
                <Col lg="4">
                    <FloatingLabel label="Solicitante">
                        <Form.Control
                            id="solicitante"
                            name="solicitante"
                            type="text"
                            placeholder="Solicitante"
                        />
                    </FloatingLabel>
                </Col>
                <Col lg="6">
                    <Form.Label className="d-flex align-items-start">Remessa e notas fiscais</Form.Label>
                    <Form.Control
                        id="anexo"
                        name="anexo"
                        type="file"
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Dados: {JSON.stringify(formData)}</p>
                    <Button type="submit">Enviar</Button>
                </Col>
            </Row>
        </Form>
    );
}