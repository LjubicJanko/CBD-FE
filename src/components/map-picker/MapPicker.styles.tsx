import styled from 'styled-components';

export const MapWrapper = styled.div`
  width: 100%;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.SECONDARY_3};

  .leaflet-container {
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.PRIMARY_1};
  }
`;
