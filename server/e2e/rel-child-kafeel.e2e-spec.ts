import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { RelChildKafeelDTO } from '../src/service/dto/rel-child-kafeel.dto';
import { RelChildKafeelService } from '../src/service/rel-child-kafeel.service';

describe('RelChildKafeel Controller', () => {
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
      .overrideProvider(RelChildKafeelService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all rel-child-kafeels ', async () => {
    const getEntities: RelChildKafeelDTO[] = (await request(app.getHttpServer()).get('/api/rel-child-kafeels').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET rel-child-kafeels by id', async () => {
    const getEntity: RelChildKafeelDTO = (
      await request(app.getHttpServer())
        .get('/api/rel-child-kafeels/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create rel-child-kafeels', async () => {
    const createdEntity: RelChildKafeelDTO = (
      await request(app.getHttpServer()).post('/api/rel-child-kafeels').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update rel-child-kafeels', async () => {
    const updatedEntity: RelChildKafeelDTO = (await request(app.getHttpServer()).put('/api/rel-child-kafeels').send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update rel-child-kafeels from id', async () => {
    const updatedEntity: RelChildKafeelDTO = (
      await request(app.getHttpServer())
        .put('/api/rel-child-kafeels/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE rel-child-kafeels', async () => {
    const deletedEntity: RelChildKafeelDTO = (
      await request(app.getHttpServer())
        .delete('/api/rel-child-kafeels/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
