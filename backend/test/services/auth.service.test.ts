import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../src/services/AuthService';

type UserRepoMock = {
  findOneBy: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockRepo: UserRepoMock;

  mockRepo = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    mockRepo = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    authService = new AuthService();
    Object.defineProperty(authService, 'userRepo', { get: () => mockRepo });
  });

  // ------------------ REGISTER ------------------
  it('Al registrarse un usuario, el email ya registrado', async () => {
    mockRepo.findOneBy.mockImplementation(({ email }) => (email ? { id: 1, email } : null));

    await expect(authService.register({ email: 'test@test.com', dni: '123' })).rejects.toThrow(
      'El email ya esta registrado.',
    );
  });

  it('Al registrarse un usuario, el DNI ya se encuentra registrado', async () => {
    mockRepo.findOneBy.mockImplementation(({ email, dni }) => {
      if (email) return null;
      if (dni) return { id: 1, dni };
      return null;
    });

    await expect(authService.register({ email: 'nuevo@test.com', dni: '123' })).rejects.toThrow(
      'El DNI ya esta registrado.',
    );
  });

  it('crea y guarda usuario correctamente', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    mockRepo.create.mockImplementation((data) => data);
    mockRepo.save.mockImplementation((data) => ({ id: 1, ...data }));

    const data = {
      email: 'nuevo@test.com',
      dni: '456',
      nombre: 'Juan',
      apellido: 'Perez',
      password: '123456',
    };

    const result = await authService.register(data);

    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(mockRepo.save).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: 1, ...data });
  });

  // ------------------ LOGIN ------------------
  it('lanza error si email o password incorrectos', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login('x@test.com', '123')).rejects.toThrow('NOT_FOUND');
  });

  it('retorna un token si login correcto', async () => {
    const user = { id: 1, email: 'test@test.com', password: 'hashed' };
    mockRepo.findOneBy.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token-falso');

    const token = await authService.login('test@test.com', '123456');

    expect(token).toBe('token-falso');
    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed');
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1, email: 'test@test.com' }, expect.any(String), {
      expiresIn: '1h',
    });
  });
});
