package com.asdf.minlog.service;

import com.asdf.minlog.dto.UserRequestDto;
import com.asdf.minlog.dto.UserResponseDto;
import com.asdf.minlog.entity.User;
import com.asdf.minlog.exception.UserNotFoundException;
import com.asdf.minlog.repository.UserRepository;
import com.asdf.minlog.util.EntityDtoMapper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getUsers(){
        return userRepository.findAll().stream()
                .map(EntityDtoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<UserResponseDto> getUserById(Long userId){
        return userRepository.findById(userId).map(EntityDtoMapper::toDto);
    }

    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        if (userRepository.findByUsername(userRequestDto.getUsername()).
                isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 사용자 이름 입니다");
        }
        User saveduser =
                userRepository.save(
                        User.builder()
                                .username(userRequestDto.getUsername())
                                .password(userRequestDto.getPassword())
                                .build());
        return EntityDtoMapper.toDto(saveduser);

    }

    public UserResponseDto updateUser(Long userId, UserRequestDto userRequestDto) {
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                ()->
                                        new UserNotFoundException(
                                                String.format("해당 아아디(%d)를 가진 사용자를 찾을 수 없습니다.",userId)));
        user.setUsername(userRequestDto.getUsername());
        user.setPassword(userRequestDto.getPassword());

        var updateduser =
                userRepository.save(user);
        return EntityDtoMapper.toDto(updateduser);
    }

    public void deleteUser(Long userId) {
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                ()->
                                        new UserNotFoundException(
                                                String.format("해당 아이디(%d)를 가진 사용자를 찾을 수 없습니다.",userId)));
        userRepository.deleteById(user.getId());
    }
}
