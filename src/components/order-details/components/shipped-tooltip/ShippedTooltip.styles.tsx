import styled, { css } from 'styled-components';
import CbdModal from '../../../cbd-modal/CbdModal.component';
import theme from '../../../../styles/theme';
import { mobile } from '../../../../util/breakpoints';

export const ShipmentModalContainer = styled(CbdModal)`
    background-color: ${theme.PRIMARY_1};

    .modal-title {
        color: ${theme.SECONDARY_1};
    }

    .modal-close-button {
        color: ${theme.SECONDARY_1};
    }

    .shipment-info {
        display: flex;
        flex-direction: column;
        gap: 16px;

        &__row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 16px;
            background-color: rgba(255, 255, 255, 0.08);
            border-radius: 8px;

            ${mobile(css`
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            `)}
        }

        &__label {
            font-size: 13px;
            color: ${theme.SECONDARY_3};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
        }

        &__value {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 16px;
            font-weight: 600;
            color: ${theme.SECONDARY_1};
            word-break: break-all;
        }

        &__actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 8px;
        }
    }

    form {
        width: 100%;
        display: flex;
        flex-direction: column;

        .fields {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 16px;
        }

        .postal-service-input,
        .postal-code-input {
            width: 100%;
        }

        .submit-button {
            background-color: ${theme.PRIMARY_2};
            color: ${theme.PRIMARY_1};
        }

        p.error {
            color: red;
            padding-left: 16px;
            font-size: 14px;
            margin: 0;
            margin-top: 4px;
        }

        .form-actions {
            display: flex;
            gap: 12px;

            ${mobile(css`
                flex-direction: column;
            `)}
        }

        .cancel-button {
            color: ${theme.SECONDARY_1};
            border-color: ${theme.SECONDARY_1};
        }
    }
`;
