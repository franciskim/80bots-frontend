import React from 'react';
import styled from '@emotion/styled';
import Button from '../default/Button';
import Badge from '../default/Badge';
import { Card, CardBody } from '../default/Card';
import { Table, Thead } from '../default/Table';

const TEMP_BOTS = [
  { name: 'Bot 1', description: 'Description 1', platform: 'Facebook', tags: [ 'bot', 'facebook' ] },
  { name: 'Bot 2', description: 'Description 2', platform: 'Telegram', tags: [ 'bot', 'telegram' ] },
  { name: 'Bot 3', description: 'Description 3', platform: 'Google', tags: [ 'bot', 'goggle' ] },
  { name: 'Bot 4', description: 'Description 4', platform: 'Twitter', tags: [ 'bot', 'twitter' ] },
];

const Container = styled(Card)`
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Launch = styled(Button)`
  padding: 0 10px;
  font-size: 16px;
`;

const Tag = styled(Badge)`
  margin-right: .5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const Bots = () => {
  const renderRow = (bot, idx) => <tr key={idx}>
    <td>{ bot.name }</td>
    <td>{ bot.description }</td>
    <td>{ bot.platform }</td>
    <td>{ bot.tags.map((tag, idx) => <Tag key={idx} pill type={'info'}>{ tag }</Tag>) }</td>
    <td><Launch type={'primary'}>Launch</Launch></td>
  </tr>;

  return(
    <Container>
      <CardBody>
        <Table responsive>
          <Thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Platform</th>
              <th>Tags</th>
              <th>Action</th>
            </tr>
          </Thead>
          <tbody>
            { TEMP_BOTS.map(renderRow) }
          </tbody>
        </Table>
      </CardBody>
    </Container>
  );
};

export default Bots;