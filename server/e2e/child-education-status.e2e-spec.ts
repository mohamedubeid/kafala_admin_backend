import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildEducationStatusDTO } from '../src/service/dto/child-education-status.dto';
import { ChildEducationStatusService } from '../src/service/child-education-status.service';

describe('ChildEducationStatus Controller', () => {
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
      .overrideProvider(ChildEducationStatusService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-education-statuses ', async () => {
    const getEntities: ChildEducationStatusDTO[] = (await request(app.getHttpServer()).get('/api/child-education-statuses').expect(200))
      .body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-education-statuses by id', async () => {
    const getEntity: ChildEducationStatusDTO = (
      await request(app.getHttpServer())
        .get('/api/child-education-statuses/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-education-statuses', async () => {
    const createdEntity: ChildEducationStatusDTO = (
      await request(app.getHttpServer()).post('/api/child-education-statuses').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-education-statuses', async () => {
    const updatedEntity: ChildEducationStatusDTO = (
      await request(app.getHttpServer()).put('/api/child-education-statuses').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-education-statuses from id', async () => {
    const updatedEntity: ChildEducationStatusDTO = (
      await request(app.getHttpServer())
        .put('/api/child-education-statuses/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-education-statuses', async () => {
    const deletedEntity: ChildEducationStatusDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-education-statuses/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
