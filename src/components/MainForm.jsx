import { useEffect, useState, useImperativeHandle } from "react";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { LabelContent, InvalidFeedback } from './Display';
import { currentStepIs, currentStepOrNone } from '../logic/flow.js';
import { useDependentValidation } from "../validation/helpers.jsx";
import FieldArrayRow from "./FieldArrayRow.jsx";

export default function MainForm({ data, ref }) {
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: data,
        resolver: zodResolver(formValidationSchema),
    });

    const {
        register, handleSubmit, watch, reset, getValues, trigger,
        control, formState: { errors, touchedFields },
    } = form;

    const { fields: arrayFields, append, remove } = useFieldArray({
        control, name: 'notasFiscais',
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

    const tipoSolicitacao = watch('tipoSolicitacao');
    //const formData = watch();
    const formData = {};

    useDependentValidation(form, {
        watch: 'tipoSolicitacao', trigger: ['numeroRemessa'],
    });

    if (arrayFields.length === 0) {
        append();
    }

    return (
        <Form noValidate onSubmit={handleSubmit(() => {
            console.log('Dados enviados.');
        })}>
            <Row className="mt-2 mb-4">
                <Col className="d-flex align-items-start">
                    <h5 style={{ color: 'black' }}><strong><em>Solicitação</em></strong></h5>
                </Col>
            </Row>
            <Row className="section-row g-3 pb-3">
                <Col xs="4">
                    <FloatingLabel label="Tipo de solicitação" controlId="tipoSolicitacao">
                        <Form.Select
                            {...register('tipoSolicitacao')}
                            isInvalid={errors.tipoSolicitacao}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="1">1 - Aprovação de remessas de NF-e</option>
                            <option value="2">2 - Aprovação de contrato</option>
                        </Form.Select>
                        <InvalidFeedback message={errors.tipoSolicitacao?.message} />
                    </FloatingLabel>
                </Col>
                <Col xs="2" className={tipoSolicitacao === '1' ? '' : 'd-none'}>
                    <FloatingLabel label="Número" controlId="numeroRemessa">
                        <Form.Control
                            type="number"
                            placeholder="Número"
                            {...register('numeroRemessa')}
                            isInvalid={errors.numeroRemessa}
                            required={tipoSolicitacao === '1'}
                            disabled={!currentStepIs(steps.request)}
                        //isValid={touchedFields.numeroRemessa && !errors.numeroRemessa}
                        />
                        <InvalidFeedback message={errors.numeroRemessa?.message} />
                    </FloatingLabel>
                </Col>
                <Col xs="2">
                    <FloatingLabel label="Data">
                        <Form.Control
                            id="dataRemessa"
                            name="dataRemessa"
                            type="date"
                            placeholder="Data"
                            disabled
                        />
                    </FloatingLabel>
                </Col>
                <Col xs="2">
                    <FloatingLabel label="Quantidade de notas">
                        <Form.Control
                            id="quantidadeNotasRemessa"
                            name="quantidadeNotasRemessa"
                            type="number"
                            placeholder="Quantidade de notas"
                            disabled
                        />
                    </FloatingLabel>
                </Col>
                <Col xs="2">
                    <FloatingLabel label={
                        <LabelContent label="Categoria" tooltip="Categoria da remessa com base em seu valor ( <= 1000 = baixo valor, > 1000 = alto valor)"></LabelContent>
                    }>
                        <Form.Control
                            id="categoriaRemessa"
                            name="categoriaRemessa"
                            type="text"
                            placeholder="Categoria"
                            disabled
                        />
                    </FloatingLabel>
                </Col>
                <Col xs="2">
                    <FloatingLabel label="Valor total">
                        <Form.Control
                            id="valorTotalRemessa"
                            name="valorTotalRemessa"
                            type="text"
                            placeholder="Valor total"
                            disabled
                        />
                    </FloatingLabel>
                </Col>
                <Col xs="4">
                    <FloatingLabel label="Solicitante">
                        <Form.Control
                            id="solicitante"
                            name="solicitante"
                            type="text"
                            placeholder="Solicitante"
                            disabled
                        />
                    </FloatingLabel>
                </Col>
                <Col xs="6">
                    <Form.Label className="d-flex align-items-start" htmlFor="anexo">Remessa e notas fiscais</Form.Label>
                    <Form.Control
                        id="anexo"
                        name="anexo"
                        type="file"
                    />
                </Col>
            </Row>
            {tipoSolicitacao === '1' && (<>
                <Row className="mt-4 mb-4">
                    <Col className="d-flex align-items-start">
                        <h6 style={{ color: 'black' }}><strong>Notas fiscais</strong></h6>
                    </Col>
                </Row>
                {arrayFields.map((field, index) => {
                    const builder = ({ rowFields, watched, rowErrors }) => {
                        return (
                            <Row className="section-row g-3 pb-3">
                                <Col xs="2">
                                    <FloatingLabel label="Empresa" controlId={rowFields.empresa}>
                                        <Form.Control
                                            {...register(rowFields.empresa, {
                                                valueAsNumber: true,
                                            })}
                                            type="number"
                                            placeholder="Empresa"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="2">
                                    <FloatingLabel label="Filial" controlId={rowFields.filial}>
                                        <Form.Control
                                            {...register(rowFields.filial, {
                                                valueAsNumber: true,
                                            })}
                                            type="number"
                                            placeholder="Filial"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="4">
                                    <FloatingLabel label="Nome da filial" controlId={rowFields.nomeFilial}>
                                        <Form.Control
                                            {...register(rowFields.nomeFilial)}
                                            type="text"
                                            placeholder="Nome da filial"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="2">
                                    <FloatingLabel label="Série" controlId={rowFields.serie}>
                                        <Form.Control
                                            {...register(rowFields.serie)}
                                            type="text"
                                            placeholder="Série"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="2">
                                    <FloatingLabel label="Fornecedor" controlId={rowFields.fornecedor}>
                                        <Form.Control
                                            {...register(rowFields.fornecedor, {
                                                valueAsNumber: true,
                                            })}
                                            type="number"
                                            placeholder="Fornecedor"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="4">
                                    <FloatingLabel label="Nome do fornecedor" controlId={rowFields.nomeFornecedor}>
                                        <Form.Control
                                            {...register(rowFields.nomeFornecedor)}
                                            type="text"
                                            placeholder="Nome do fornecedor"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="2">
                                    <FloatingLabel label="Número" controlId={rowFields.numero}>
                                        <Form.Control
                                            {...register(rowFields.numero, {
                                                valueAsNumber: true,
                                            })}
                                            type="number"
                                            placeholder="Número"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="2">
                                    <FloatingLabel label="Data de emissão" controlId={rowFields.emissao}>
                                        <Form.Control
                                            {...register(rowFields.emissao, {
                                                valueAsDate: true,
                                            })}
                                            type="date"
                                            placeholder="Data de emissão"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="2">
                                    <FloatingLabel label="Data de entrada" controlId={rowFields.entrada}>
                                        <Form.Control
                                            {...register(rowFields.entrada, {
                                                valueAsDate: true,
                                            })}
                                            type="date"
                                            placeholder="Data de entrada"
                                            disabled
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="2">
                                    <Form.Check>
                                        <Form.Check.Input
                                            id={rowFields.reprovar}
                                            {...register(rowFields.reprovar)}
                                            type="checkbox"
                                        />
                                        <Form.Check.Label className="ms-2" htmlFor={rowFields.reprovar}>
                                            Reprovar
                                        </Form.Check.Label>
                                    </Form.Check>
                                </Col>
                                <Col xs="4" className={!watched.reprovar ? 'd-none' : ''}
                                >
                                    <FloatingLabel label="Motivo" controlId={rowFields.nomeFornecedor}>
                                        <Form.Control
                                            {...register(rowFields.motivo)}
                                            as="textarea"
                                            placeholder="Motivo"
                                            style={{ height: "5lh" }}
                                            required={watched.reprovar}
                                            isInvalid={rowErrors?.motivo}
                                        >
                                        </Form.Control>
                                        <InvalidFeedback message={rowErrors?.motivo?.message} />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        );
                    };

                    return (
                        <FieldArrayRow
                            key={field.id}
                            form={form}
                            field={field}
                            arrayName={'notasFiscais'}
                            index={index}
                            validationDependencies={[
                                { fieldName: 'reprovar', targetFields: ['motivo'] },
                            ]}
                            fieldIds={[
                                'empresa', 'filial', 'nomeFilial', 'serie', 'fornecedor', 'nomeFornecedor',
                                'numero', 'emissao', 'entrada', 'reprovar', 'motivo',
                            ]}
                            builder={builder}>
                        </FieldArrayRow>
                    );
                })}
            </>)}


            {true && <Row>
                <Col>
                    <p>Dados: {JSON.stringify(formData)}</p>
                    <Button type="submit">Enviar</Button>
                </Col>
            </Row>}
        </Form>
    );
}

const steps = {
    request: '1',
};

const arraySchema = z.object({
    reprovar: z.boolean(),
    motivo: z.string().nullish(),
}).superRefine((data, context) => {
    if (data.reprovar && !data.motivo) {
        context.addIssue({
            code: 'custom',
            message: 'O motivo da reprovação é obrigatório.',
            path: ['motivo'],
        });
    }
});

const formValidationSchema = z.object({
    tipoSolicitacao: z.string({ error: 'Este campo é obrigatório.' }),
    numeroRemessa: z.string().nullish(),
    notasFiscais: z.array(arraySchema).optional(),
}).superRefine((data, context) => {
    if (data.tipoSolicitacao === '1') {
        if (!data.numeroRemessa) {
            context.addIssue({
                code: 'custom',
                message: 'O número da remessa é obrigatório.',
                path: ['numeroRemessa'],
            });
        }
    }
});