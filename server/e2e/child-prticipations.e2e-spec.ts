import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildPrticipationsDTO } from '../src/service/dto/child-prticipations.dto';
import { ChildPrticipationsService } from '../src/service/child-prticipations.service';

describe('ChildPrticipations Controller', () => {
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
      .overrideProvider(ChildPrticipationsService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-prticipations ', async () => {
    const getEntities: ChildPrticipationsDTO[] = (await request(app.getHttpServer()).get('/api/child-prticipations').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-prticipations by id', async () => {
    const getEntity: ChildPrticipationsDTO = (
      await request(app.getHttpServer())
        .get('/api/child-prticipations/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-prticipations', async () => {
    const createdEntity: ChildPrticipationsDTO = (
      await request(app.getHttpServer()).post('/api/child-prticipations').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-prticipations', async () => {
    const updatedEntity: ChildPrticipationsDTO = (
      await request(app.getHttpServer()).put('/api/child-prticipations').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-prticipations from id', async () => {
    const updatedEntity: ChildPrticipationsDTO = (
      await request(app.getHttpServer())
        .put('/api/child-prticipations/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-prticipations', async () => {
    const deletedEntity: ChildPrticipationsDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-prticipations/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
