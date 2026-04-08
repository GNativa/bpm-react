import React, { useEffect, useState, useImperativeHandle } from "react";
import { Form, Row, Col, Button, } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import Section from './layout/Section';
import { currentStepIs, currentStepOrNone } from '../logic/flow.js';
import { useDependentValidation } from "../validation/helpers";
import SelectField from "./fields/select.jsx";
import InputField from "./fields/input.jsx";
import { naturalLanguageJoin } from "../logic/text/helpers.jsx";
import CheckboxField from "./fields/checkbox.jsx";
import TextAreaField from "./fields/textarea.jsx";
import FieldArraySection from "./FieldArraySection.jsx";
import FileField from "./fields/file.jsx";
import LookupField from "./fields/lookup.jsx";
import { useToast } from "./messages/ToastContext.jsx";

/**
 * @param {{
 *  ref: React.RefObject;
 *  initialData: Object;
 *  userData: {
 *      accessToken: string;
 *  };
 * }}
 */
export default function MainForm({ ref, initialData, userData }) {
    const { showToast } = useToast();
    
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: initialData,
        resolver: zodResolver(formValidationSchema),
    });

    const {
        handleSubmit, watch, reset, getValues, trigger,
        control, formState: { errors, touchedFields },
    } = form;

    const { fields: arrayFields, append, remove } = useFieldArray({
        control, name: 'notasFiscais',
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    useImperativeHandle(ref, () => {
        return {
            validate, getData,
        };
    }, []);

    async function validate() {
        const isValid = await trigger();
        return isValid;
    }

    function getData() {
        return getValues();
    }

    const tipoSolicitacao = watch('tipoSolicitacao');
    //const formData = watch();
    const formData = {};

    useDependentValidation(form, {
        watch: 'tipoSolicitacao', trigger: ['numeroRemessa'],
    });

    // TODO: reutilizar condições
    return (
        <>
            <Button
                variant="primary"
                onClick={() => {
                    showToast({
                        variant: 'danger',
                        title: 'Título',
                        message: 'Mensagem',
                        autohide: false,
                    });
                }}
            >
                Clique aqui!
            </Button>
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
                            <LookupField
                                form={form}
                                errors={errors}
                                type="number"
                                id="numeroRemessa"
                                label="Número"
                                required={tipoSolicitacao === '1'}
                                disabled={!currentStepIs(steps.request)}
                                config={{
                                    name: 'Remessas de notas fiscais de entrada',
                                    searchField: 'numrem',
                                    token: userData.accessToken,
                                    columnMap: {
                                        numrem: 'Número',
                                        datger: 'Data de geração',
                                        usuger: 'Usuário de geração',
                                        emprem: 'Empresa',
                                        filrem: 'Filiais',
                                        qtdnfc: 'Quantidade de notas',
                                        vlrtot: 'Valor total',
                                        catrem: 'Categoria',
                                    },
                                    keyField: 'numrem',
                                }}
                                formMap={{
                                    'numeroRemessa': ['numrem'],
                                    'dataRemessa': ['datger', (datger) => {
                                        return new Date(datger).toISOString().substring(0, 10);
                                    }],
                                    'quantidadeNotasRemessa': ['qtdnfc'],
                                    'categoriaRemessa': ['catrem'],
                                    'valorTotalRemessa': ['vlrtot'],
                                }}
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
                                type="text"
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
                            <FileField
                                form={form}
                                errors={errors}
                                id="anexo"
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

                {tipoSolicitacao === '1' && (
                    <FieldArraySection
                        form={form}
                        arrayName={'notasFiscais'}
                        fieldNames={[
                            'empresa', 'filial', 'nomeFilial', 'serie', 'fornecedor', 'nomeFornecedor',
                            'numero', 'emissao', 'entrada', 'reprovar', 'motivo',
                        ]}
                        title="Notas fiscais"
                        arrayFields={arrayFields}
                        validationDependencies={[
                            { fieldName: 'reprovar', defaultValue: false, targetFields: ['motivo'] },
                        ]}
                        appendFunction={append}
                        removeFunction={remove}
                        rowBuilder={({ rowFields, watched, rowErrors }) => {
                            return [{
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.empresa}
                                        type="number"
                                        label="Empresa"
                                        disabled
                                    />
                                ),
                                width: 2,
                            }, {
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.filial}
                                        type="number"
                                        label="Filial"
                                        disabled
                                    />
                                ),
                                width: 2,
                            }, {
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.nomeFilial}
                                        type="text"
                                        label="Nome da filial"
                                        disabled
                                    />
                                ),
                                width: 4,
                            }, {
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.serie}
                                        type="text"
                                        label="Série"
                                        disabled
                                    />
                                ),
                                width: 2,
                            }, {
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.fornecedor}
                                        type="number"
                                        label="Fornecedor"
                                        disabled
                                    />
                                ),
                                width: 2,
                            }, {
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.nomeFornecedor}
                                        type="text"
                                        label="Nome do fornecedor"
                                        disabled
                                    />
                                ),
                                width: 4,
                            }, {
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.numero}
                                        type="number"
                                        label="Número"
                                        disabled
                                    />
                                ),
                                width: 2,
                            }, {
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.emissao}
                                        type="date"
                                        label="Data de emissão"
                                        disabled
                                    />
                                ),
                                width: 2,
                            }, {
                                children: (
                                    <InputField
                                        form={form}
                                        id={rowFields.entrada}
                                        type="date"
                                        label="Data de entrada"
                                        disabled
                                    />
                                ),
                                width: 2,
                            }, {
                                children: (
                                    <CheckboxField
                                        form={form}
                                        errors={rowErrors}
                                        id={rowFields.reprovar}
                                        label="Reprovar"
                                        hint="Marque aqui caso queira reprovar esta nota fiscal."
                                    />
                                ),
                                width: 2,
                            }, {
                                children: (
                                    <TextAreaField
                                        form={form}
                                        errors={rowErrors}
                                        id={rowFields.motivo}
                                        fieldName="motivo"
                                        label="Motivo"
                                        required={watched.reprovar}
                                    />
                                ),
                                width: 4,
                                visible: watched.reprovar,
                            }];
                        }}
                    />
                )}

                {true && <Row>
                    <Col>
                        <p>Dados: {JSON.stringify(formData)}</p>
                        <Button type="submit">Enviar</Button>
                    </Col>
                </Row>}
            </Form>
        </>
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