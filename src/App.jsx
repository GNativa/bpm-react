import { useEffect, useState, useRef } from "react";
import MainForm from "./components/MainForm";
import { initBPMBridge } from "./bpmBridge";
import { Container } from "react-bootstrap";

export default function App() {
  const [formData, setFormData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const formRef = useRef(null);
  const initializationRef = useRef(false);

  const onSubmit = async () => {
    const currentRef = formRef.current;

    if (!currentRef) {
      throw new Error('O formulário ainda não foi carregado.');
    }

    const isValid = await currentRef.validate();

    if (!isValid) {
      // TODO: expor função no useImperativeHandle do MainForm para exibir mensagem
      throw new Error('Dados inválidos. Preencha todos os campos obrigatórios e verifique as '
        + 'informações inseridas no formulário para prosseguir');
    }

    return currentRef.getData();
  }

  useEffect(() => {
    initBPMBridge({
      onLoad: async (incomingData, info) => {
        const data = {};
        const { initialVariables } = incomingData['loadContext'];

        for (const prop in initialVariables) {
          data[prop] = initialVariables[prop];
        }

        try {
          // const userData = await info.getUserData();
          // const taskData = await info.getTaskData();
          const platformData = await info.getPlatformData();
          // TODO: salvar token em algum canto
          const accessToken = platformData.token.access_token;
          const variableData = await info.getInfoFromProcessVariables();

          if (info.isRequestNew() || !Array.isArray(variableData)) {
            setFormData(data);
            return;
          }

          for (let i = 0; i < variableData.length; i++) {
            /** @type {{key: string, value: any}} */
            const item = variableData[i];

            if (data[item.key]) {
              continue;
            }

            data[item.key] = item.value || '';
          }

          setFormData(data);
        }
        catch (e) {
          console.error(`Erro ao carregar os dados: ${e}`);
        }

        setLoaded(true);
      },
      onSubmit: async () => {
        const data = await onSubmit();
        return {
          formData: data,
        };
      },
      onError: (err) => {
        console.error("Erro no BPM:", err);
      },
      initializationRef,
    });
  }, []);

  useEffect(() => {
    if (initializationRef.current) {
      return;
    }

    initializationRef.current = true;
  }, []);

  return (
    <Container fluid>
      <MainForm ref={formRef} data={formData} loaded={loaded} />
    </Container>
  );
}