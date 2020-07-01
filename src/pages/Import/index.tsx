import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import Upload from '../../components/Upload';
import FileList from '../../components/FileList';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import api from '../../services/api';
import alert from '../../assets/alert.svg';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const history = useHistory();

  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);

  async function handleUpload(): Promise<void> {
    uploadedFiles.forEach(async file => {
      const data = new FormData();

      data.append('file', file.file);

      try {
        await api.post('/transactions/import', data);

        if (uploadedFiles.indexOf(file) === uploadedFiles.length - 1) {
          history.goBack();
        }
      } catch {
        // console.log(err.response.error);
      }
    });
  }

  function submitFile(files: File[]): void {
    const filesToUpload = files.map(file => {
      return {
        file,
        name: file.name,
        readableSize: filesize(file.size),
      };
    });

    setUploadedFiles(filesToUpload);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
