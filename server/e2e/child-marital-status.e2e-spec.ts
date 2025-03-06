import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildMaritalStatusDTO } from '../src/service/dto/child-marital-status.dto';
import { ChildMaritalStatusService } from '../src/service/child-marital-status.service';

describe('ChildMaritalStatus Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId',
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    deleteById: (): any => entityMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(ChildMaritalStatusService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-marital-statuses ', async () => {
    const getEntities: ChildMaritalStatusDTO[] = (await request(app.getHttpServer()).get('/api/child-marital-statuses').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-marital-statuses by id', async () => {
    const getEntity: ChildMaritalStatusDTO = (
      await request(app.getHttpServer())
        .get('/api/child-marital-statuses/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-marital-statuses', async () => {
    const createdEntity: ChildMaritalStatusDTO = (
      await request(app.getHttpServer()).post('/api/child-marital-statuses').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-marital-statuses', async () => {
    const updatedEntity: ChildMaritalStatusDTO = (
      await request(app.getHttpServer()).put('/api/child-marital-statuses').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-marital-statuses from id', async () => {
    const updatedEntity: ChildMaritalStatusDTO = (
      await request(app.getHttpServer())
        .put('/api/child-marital-statuses/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-marital-statuses', async () => {
    const deletedEntity: ChildMaritalStatusDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-marital-statuses/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
