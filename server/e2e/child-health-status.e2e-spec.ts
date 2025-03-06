import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildHealthStatusDTO } from '../src/service/dto/child-health-status.dto';
import { ChildHealthStatusService } from '../src/service/child-health-status.service';

describe('ChildHealthStatus Controller', () => {
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
      .overrideProvider(ChildHealthStatusService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-health-statuses ', async () => {
    const getEntities: ChildHealthStatusDTO[] = (await request(app.getHttpServer()).get('/api/child-health-statuses').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-health-statuses by id', async () => {
    const getEntity: ChildHealthStatusDTO = (
      await request(app.getHttpServer())
        .get('/api/child-health-statuses/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-health-statuses', async () => {
    const createdEntity: ChildHealthStatusDTO = (
      await request(app.getHttpServer()).post('/api/child-health-statuses').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-health-statuses', async () => {
    const updatedEntity: ChildHealthStatusDTO = (
      await request(app.getHttpServer()).put('/api/child-health-statuses').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-health-statuses from id', async () => {
    const updatedEntity: ChildHealthStatusDTO = (
      await request(app.getHttpServer())
        .put('/api/child-health-statuses/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-health-statuses', async () => {
    const deletedEntity: ChildHealthStatusDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-health-statuses/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
