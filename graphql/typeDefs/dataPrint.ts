import { gql } from 'apollo-server-express';

const fields = `
  svg: String
  thumbnailUri: String
  patientId: Int
`;

export default gql`
  extend type Query {
    dataPrints: [DataPrint] @listArgs
    dataPrint: DataPrint @defaultArgs
  }

  extend type Mutation {
    createDataPrint(dataPrint: DataPrintCreate): DataPrint
    updateDataPrint(dataPrint: DataPrintUpdate): DataPrint
    destroyDataPrint(dataPrint: DataPrintDestroy): DataPrint
  }

  type DataPrint {
    id: Int
    
    ${fields}

    patient: Patient
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input DataPrintCreate {
    ${fields}
  }

  input DataPrintUpdate {
    id: Int!
    ${fields}
  }

  input DataPrintDestroy {
    id: Int!
  }
`;
