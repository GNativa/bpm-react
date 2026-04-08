import { useEffect, useState, useRef } from "react";
import { initBPMBridge } from "./bpmBridge";
import { Container, Spinner } from "react-bootstrap";

import MainForm from "./components/MainForm";
import { useToast } from "./components/messages/ToastContext";

export default function App() {
  const [formData, setFormData] = useState({});
  const [userData, setUserData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const formRef = useRef(null);
  const initializationRef = useRef(false);
  const { showToast } = useToast();

  async function onLoad(incomingData, info) {
    const data = {};
    const { initialVariables } = incomingData['loadContext'];

    for (const prop in initialVariables) {
      data[prop] = initialVariables[prop];
    }

    try {
      const userData = await info.getUserData();
      // const taskData = await info.getTaskData();
      const platformData = await info.getPlatformData();
      // TODO: salvar token em algum canto
      const accessToken = platformData.token.access_token;
      const variableData = await info.getInfoFromProcessVariables();

      userData.accessToken = accessToken;
      setUserData(userData);

      if (info.isRequestNew() || !Array.isArray(variableData)) {
        setFormData(data);
        setLoaded(true);
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
  }

  async function onSubmit() {
    const currentRef = formRef.current;

    if (!currentRef) {
      const msg = 'O formulário ainda não foi carregado.';
      showToast({
        variant: 'danger',
        title: 'Estado inválido!',
        message: msg,
      });
      throw new Error(msg);
    }

    const isValid = await currentRef.validate();

    if (!isValid) {
      const msg = 'Preencha todos os campos obrigatórios e verifique as '
        + 'informações inseridas no formulário para prosseguir.';

      showToast({
        variant: 'danger',
        title: 'Dados inválidos',
        message: msg,
      });

      throw new Error(msg);
    }

    const data = await  currentRef.getData();
    
    return {
      formData: data,
    };
  }

  async function onError(err) {
    console.error("Erro no BPM:", err);
  }

  useEffect(() => {
    initBPMBridge({
      onLoad,
      onSubmit,
      onError,
      initializationRef,
    });
  }, []);

  useEffect(() => {
    if (initializationRef.current) {
      return;
    }

    initializationRef.current = true;
  }, []);

  if (!loaded) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: '100vw', height: '100vh' }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid>
      <MainForm ref={formRef} initialData={formData} userData={userData} />
    </Container>
  );
}