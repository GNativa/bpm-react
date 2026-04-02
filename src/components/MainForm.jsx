import { useEffect, useState, useImperativeHandle } from "react";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import Section from './layout/Section';
import { LabelContent, InvalidFeedback } from './Display';
import { currentStepIs, currentStepOrNone } from '../logic/flow.js';
import { useDependentValidation } from "../validation/helpers";
import FieldArrayRow from "./FieldArrayRow";
import SelectField from "./fields/select.jsx";
import InputField from "./fields/input.jsx";
import { naturalLanguageJoin } from "./text/helpers.jsx";

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

    useDependentValidation(form, {
        watch: 'tipoSolicitacao', trigger: ['numeroRemessa'],
    });

    useEffect(() => {
        if (arrayFields.length === 0) {
            append();
        }
    }, [arrayFields, append]);

    // TODO: reutilizar condições

    return (
        <Form noValidate onSubmit={handleSubmit(() => {
            console.log('Dados enviados.');
        })}>
            <Section
                title="Solicitação"
                columns={[{
                    children: (
                        <SelectField
                            form={form}
                            errors={errors}
                            id="tipoSolicitacao"
                            label="Tipo de solicitação"
                            required
                            options={[
                                { value: '1', label: 'Aprovação de remessas de NF-e', },
                                { value: '2', label: 'Aprovação de contrato', },
                            ]}
                        />
                    ),
                    width: 4,
                }, {
                    children: (
                        <InputField
                            form={form}
                            errors={errors}
                            type="number"
                            id="numeroRemessa"
                            label="Número"
                            required={tipoSolicitacao === '1'}
                            disabled={!currentStepIs(steps.request)}
                        />
                    ),
                    width: 2,
                    visible: tipoSolicitacao === '1',
                }, {
                    children: (
                        <InputField
                            form={form}
                            errors={errors}
                            type="date"
                            id="dataRemessa"
                            label="Data"
                            disabled
                        />
                    ),
                    width: 2,
                    visible: tipoSolicitacao === '1',
                }, {
                    children: (
                        <InputField
                            form={form}
                            errors={errors}
                            type="number"
                            id="quantidadeNotasRemessa"
                            label="Quantidade de notas"
                            disabled
                        />
                    ),
                    width: 2,
                    visible: tipoSolicitacao === '1',
                }, {
                    children: (
                        <InputField
                            form={form}
                            errors={errors}
                            type="text"
                            id="categoriaRemessa"
                            label="Categoria"
                            hint="Categoria da remessa com base em seu valor ( <= 1000 = baixo valor, > 1000 = alto valor)"
                            disabled
                        />
                    ),
                    width: 2,
                    visible: tipoSolicitacao === '1',
                }, {
                    children: (
                        <InputField
                            form={form}
                            errors={errors}
                            type="number"
                            id="valorTotalRemessa"
                            label="Valor total"
                            disabled
                        />
                    ),
                    width: 2,
                    visible: tipoSolicitacao === '1',
                }, {
                    children: (
                        <InputField
                            form={form}
                            errors={errors}
                            type="text"
                            id="solicitante"
                            label="Solicitante"
                            disabled
                        />
                    ),
                    width: 4,
                    visible: tipoSolicitacao === '1',
                }, {
                    children: (
                        <InputField
                            form={form}
                            errors={errors}
                            id="anexo"
                            type="file"
                            label={(() => {
                                switch (tipoSolicitacao) {
                                    case '1':
                                        return 'Remessa e notas fiscais';
                                    case '2':
                                        return 'Contrato';
                                    default:
                                        return 'Anexo';
                                }
                            })()}
                            required
                            multiple={tipoSolicitacao === '1'}
                        />
                    ),
                    width: 6,
                }]}
            />

            {tipoSolicitacao === '1' && (<>
                <Row className="mt-4 mb-4">
                    <Col className="d-flex align-items-start">
                        <div className="title-sm">
                            Notas fiscais
                        </div>
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


            {false && <Row>
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

const requiredMsg = 'Este campo é obrigatório.';

const arraySchema = z.object({
    reprovar: z.boolean(),
    motivo: z.string().nullish(),
}).superRefine((data, context) => {
    if (data.reprovar && !data.motivo) {
        context.addIssue({
            code: 'custom',
            message: requiredMsg,
            path: ['motivo'],
        });
    }
});


const supportedFormats = ['png', 'jpg', 'jpeg', 'pdf'];

const formValidationSchema = z.object({
    tipoSolicitacao: z.string().min(1, requiredMsg),
    numeroRemessa: z.number().nullish(),
    anexo: z.custom()
        .transform((files) => {
            /** @type {File[]} */
            const asArray = Array.from(files);
            return asArray;
        })
        .refine((files) => files?.length >= 1, 'Você deve anexar ao menos um arquivo.')
        .refine(
            (files) => files && files.every(f => supportedFormats.some(s => f.type.toLowerCase().endsWith(s))),
            `Somente são suportados os formatos ${naturalLanguageJoin(supportedFormats)}.`,
        ),
    notasFiscais: z.array(arraySchema).optional(),
}).superRefine((data, context) => {
    if (data.tipoSolicitacao === '1') {
        if (!data.numeroRemessa) {
            context.addIssue({
                code: 'custom',
                message: requiredMsg,
                path: ['numeroRemessa'],
            });
        }
    }
});